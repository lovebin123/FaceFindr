# Use an official Python runtime as a parent image
FROM python:3.11.7-slim
COPY retinaface.h5 /root/.deepface/weights/retinaface.h5
COPY arcface_weights.h5 /root/.deepface/weights/arcface_weights.h5
# Set the working directory in the container
WORKDIR /app

# Install necessary system packages
RUN apt-get update && \
    apt-get install -y libgl1-mesa-glx libglib2.0-0 libsm6 libxrender1 libxext6 && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Copy the current directory contents into the container at /app
COPY . /app

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Make port 5050 available to the world outside this container
EXPOSE 5000

# Define environment variable
ENV NAME World

# Run face_backend.py when the container launches
CMD ["python", "face_backend.py"]
