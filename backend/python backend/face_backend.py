from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from werkzeug.utils import secure_filename
import cv2
from retinaface import RetinaFace
from deepface import DeepFace
import redis
import random
import string
import ast
import logging
import supabase
from dotenv import load_dotenv

load_dotenv()
app = Flask(__name__)
CORS(app)  # Allow CORS for all routes
app.config['MAX_CONTENT_LENGTH'] = 20 * 1024 * 1024

# Configure logging
logging.basicConfig(level=logging.INFO)

def find_similar_pairs(image_path):
    face_array = []
    faces = RetinaFace.extract_faces(img_path=image_path, align=True) #Using RetinaFace to extract faces from the image

    for face in faces:
        face_array.append(face)

    embeddings = []
    for face in face_array:
        embedding_objs = DeepFace.represent(face, model_name='ArcFace', detector_backend='retinaface', enforce_detection=False) #Using DeepFace to generate embeddings for each face
        embedding = embedding_objs[0]["embedding"]
        embeddings.append(embedding)

    return face_array, embeddings

def store_faces_in_firebase(detected_faces, storage):
    file_names = []
    file_urls = []
    for face in detected_faces:
        # Generate a random filename for each face
        file_name = ''.join(random.choices(string.ascii_uppercase + string.digits, k=9)) + '.jpg'
        file_names.append(file_name)
        face_rgb = cv2.cvtColor(face, cv2.COLOR_BGR2RGB) #Converting the BGR image to RGB image
        cv2.imwrite(file_name, face_rgb) #Saving the image to the local directory temporarily

    for file_name in file_names: #Uploading the images to Supabase storage
        storage.upload(file=file_name, path=file_name, file_options={"content-type": "image"})
        url = storage.get_public_url(file_name)
        url = url[:-1]
        file_urls.append(url)
    return file_urls, file_names

def store_faces_in_redis(r, file_urls, embeddings, uploaded_url, matched_photos):
    matched_photos_str = str(matched_photos)
    for url, emb in zip(file_urls, embeddings):
        emb_str = str(emb)
        r.hset(url, mapping={'embedding': emb_str, 'matched_photos': matched_photos_str})

    # Store the uploaded URL and matched photos
    r.hset(uploaded_url, mapping={'matched_photos': matched_photos_str})

def main(image_path):
    r = redis.Redis(                                        #Connecting to Redis
        host=os.getenv('REDIS_HOST'),               
        port=int(os.getenv('REDIS_PORT')),
        password=os.getenv('REDIS_PASSWORD'),
        ssl=False,
        socket_timeout=100,
        connection_pool=None
    )

    supabase_url = os.getenv('SUPABASE_URL').replace(" ","") #Connecting to Supabase
    supabase_key = os.getenv('SUPABASE_KEY')
    client = supabase.create_client(supabase_url, supabase_key)
    face_array1, embeddings1 = find_similar_pairs(image_path) #Extracting faces and embeddings from the uploaded image
    mp = {}
    k = 0
    checker = []
    for _ in range(len(face_array1)):       #Initialising the checker list to False initially
        checker.append(False)
    for i, emb in enumerate(embeddings1):
        mp[i] = False
    storage = client.storage.from_("images")
    storage.upload(file=image_path, path=image_path, file_options={"content-type": "image"}) 
    uploaded_url = storage.get_public_url(image_path) #Uploading the image to Supabase and fetching the public_URL
    uploaded_url = uploaded_url[:-1]
    matched_photos = []
    file_names1 = []
    if r.dbsize() == 0:                             #The logic applied here is if the size of Redis database is 0 the map each url of each face with the embedding of that face and the matched photos
        file_urls, file_names1 = store_faces_in_firebase(face_array1, storage)
        matched_photos.append(str(uploaded_url))
        for url, emb in zip(file_urls, embeddings1):
            r.hset(url, mapping={'embedding': str(emb), 'matched_photos': str(matched_photos)}) #Here we have used Redis datastructure hashset for faster retrieval and traversal of data
    else:
    # If already faces are present in database then we traverse through each face and compare the corresponding embedding with the   embeddings newly generated embeddings
        for key in r.keys():
            url = key
            emb = r.hget(url, 'embedding')
            string_representation = emb.decode('utf-8').strip() #Converting the byte object to string
            embeddings2 = ast.literal_eval(string_representation) #Converting the string to list
            for i, emb1 in enumerate(embeddings1):
                distance = DeepFace.verify(emb1, embeddings2, distance_metric='euclidean_l2', model_name='ArcFace', detector_backend='retinaface', threshold=1.0)
                if distance['verified']:
                    checker[i] = True # If there are any matching faces then we set the corresponding index of checker list to True
                    matched_photos = r.hget(url, 'matched_photos') #Fetching photos that are already present in matching_face list
                    string_representation = matched_photos.decode('utf-8') #Converting the byte object to string
                    cleaned_string = string_representation[2:-1].strip()
                    matched_photos = cleaned_string.split(', ')
                    matched_photos.append(str(uploaded_url))
                    r.hset(url, "matched_photos", str(matched_photos)) #Updating the redis database with the new matched photos

        #If there are values in the checker list that are False then we add those faces to the Redis database
        for i, (face, emb) in enumerate(zip(face_array1, embeddings1)):
            l1 = [face, emb]
            mp[i] = l1
        for i in range(len(mp)):
            if checker[i]:
                mp.pop(i)

        for key in mp:
            values = mp[key]
            file_name = ''.join(random.choices(string.ascii_uppercase + string.digits, k=9)) + '.jpg'
            face_rgb = cv2.cvtColor(values[0], cv2.COLOR_BGR2RGB)
            cv2.imwrite(file_name, face_rgb)
            file_names1.append(file_name)
            storage.upload(file=file_name, path=file_name, file_options={"content-type": "image"})
            url = storage.get_public_url(file_name)
            url = url[:-1]
            matched_photos = [str(uploaded_url)]
            r.hset(url, mapping={'embedding': str(values[1]), 'matched_photos': str(matched_photos)})

    logging.info("Processing completed")
    os.remove(image_path)
    remove_files(file_names1)

def remove_files(file_names): #This function ensures that the files are removed from the local directory after processing
    for name in file_names:
        try:
            os.remove(name)
            logging.info(f"Successfully removed file: {name}")
        except FileNotFoundError:
            logging.error(f"File not found: {name}")
        except PermissionError:
            logging.error(f"Permission denied when trying to remove file: {name}")
        except Exception as e:
            logging.error(f"An error occurred while trying to remove a file {name}: {e}")

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    if file and allowed_file(file.filename):
        # Ensure the images folder exists
        images_folder = 'images/'
        if not os.path.exists(images_folder):
            os.makedirs(images_folder)
        
        # Save the uploaded file to the images directory
        filename = secure_filename(file.filename)
        file_path = os.path.join(images_folder, filename)
        file.save(file_path)
        # Process the uploaded file
        main(file_path)
        return jsonify({'message': 'File uploaded successfully'}), 200
    else:
        return jsonify({'error': 'Invalid file format'}), 400

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in {'jpg', 'jpeg', 'png', 'gif'}

if __name__ == '__main__':
    app.run(host="0.0.0.0",port=5000,debug=False)  # Run the app in debug mode for local testing
