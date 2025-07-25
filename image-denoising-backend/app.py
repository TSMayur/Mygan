# app.py
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS  # Import CORS
import cv2
import numpy as np
from tensorflow.keras.models import load_model
from werkzeug.utils import secure_filename
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

UPLOAD_FOLDER = "uploads"
MODEL_PATH = "best_model.h5"

# Load the pre-trained GAN model (placeholder for now)
# Replace this with your trained GAN model later
model = None

# Route to serve static files (e.g., images in the uploads folder)
@app.route("/uploads/<filename>")
def uploaded_file(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)

@app.route("/denoise", methods=["POST"])
def denoise():
    if "image" not in request.files:
        return jsonify({"error": "No image provided"}), 400

    file = request.files["image"]
    filename = secure_filename(file.filename)
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    file.save(filepath)

    # Load and preprocess the image
    img = cv2.imread(filepath)
    img = cv2.resize(img, (256, 256))  # Resize to match model input
    img = img / 255.0  # Normalize
    img = np.expand_dims(img, axis=0)

    # Denoise the image (placeholder for now)
    # Replace this with actual model prediction later
    denoised_img = img[0]  # Placeholder: returns the same image

    # Save the denoised image
    output_path = os.path.join(UPLOAD_FOLDER, "denoised_" + filename)
    denoised_img = (denoised_img * 255).astype(np.uint8)
    cv2.imwrite(output_path, denoised_img)

    # Return the URL of the denoised image
    return jsonify({"image_url": f"/uploads/denoised_{filename}"}), 200

if __name__ == "__main__":
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)  # Ensure the uploads folder exists
    app.run(debug=True)
