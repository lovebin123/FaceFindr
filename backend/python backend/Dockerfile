FROM python:3.11.7-slim
COPY retinaface.h5 /root/.deepface/weights/retinaface.h5
COPY arcface_weights.h5 /root/.deepface/weights/arcface_weights.h5
WORKDIR /app
RUN apt-get update && \
    apt-get install -y libgl1-mesa-glx libglib2.0-0 libsm6 libxrender1 libxext6 && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*
COPY . /app
RUN pip install --no-cache-dir -r requirements.txt
EXPOSE 5000
ENV NAME World
CMD ["python", "face_backend.py"]
