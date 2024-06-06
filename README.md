# FaceFindr

FaceFindr is a web application that allows users to upload photos and explore connections between faces across different images. Click on a face to see all the images where that face appears. Built with React JS, Redis, Flask, and DeepFace for face detection and recognition.

## Features

- Upload images and detect faces.
- Identify and match faces across multiple images.
- Explore connections by clicking on a face to view all images containing that face.

## Technologies Used

- **React JS**: Front-end library for building user interfaces.
- **Redis**: In-memory data structure store for fast access to face data.
- **Flask**: Web framework for the backend server.
- **DeepFace**: Facial recognition library for detecting and matching faces.

## Installation

### Prerequisites

- Node.js and npm
- Python 3.x
- Redis

### Backend Setup

1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/FacFindr.git
    cd Facefindr/backend
    ```

2. Create and activate a virtual environment:
    ```sh
    python -m venv venv
    source venv/bin/activate  # On Windows use `venv\Scripts\activate`
    ```

3. Install the required Python packages:
    ```sh
    pip install -r requirements.txt
    ```

4. Set up environment variables:
    - Create a `.env` file in the `backend` directory and add the following variables:
      ```
      REDIS_HOST=your_redis_host
      REDIS_PORT=your_redis_port
      REDIS_PASSWORD=your_redis_password
      SUPABASE_URL=your_supabase_url
      SUPABASE_PASSWORD=your_supabase_password
      ```
      
5. Run the Flask server:
    ```sh
    flask run
    ```

### Frontend Setup

1. Navigate to the frontend directory:
    ```sh
    cd ../frontend
    ```

2. Install the required npm packages:
    ```sh
    npm install
    ```

3. Start the development server:
    ```sh
    npm run dev
    ```

## Usage

1. Open your web browser and go to `http://localhost:5173`.
2. Upload an image using the upload button.
3. Click on face gallery to view all images containing that face.
