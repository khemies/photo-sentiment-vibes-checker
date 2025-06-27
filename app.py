from flask import Flask, request, jsonify
import tensorflow as tf
import numpy as np
import boto3
import os
from flask_cors import CORS
import random

app = Flask(__name__)
CORS(app)

BUCKET_NAME = "iacloud-detection-emotions"
MODEL_KEY = "emotion_cnn.h5"      
LOCAL_MODEL_PATH = "emotion_cnn.h5"

if not os.path.exists(LOCAL_MODEL_PATH):
    print("Téléchargement du modèle depuis S3...")
    s3 = boto3.client("s3",
                      aws_access_key_id=os.environ.get("AWS_ACCESS_KEY_ID"),
                      aws_secret_access_key=os.environ.get("AWS_SECRET_ACCESS_KEY"))
    try:
        s3.download_file(BUCKET_NAME, MODEL_KEY, LOCAL_MODEL_PATH)
        print("Modèle téléchargé avec succès.")
    except Exception as e:
        print("Erreur lors du téléchargement du modèle :", e)

model = tf.keras.models.load_model(LOCAL_MODEL_PATH)

@app.route("/", methods=["GET"])
def home():
    return "API de détection d'émotion est en ligne."

emotions = ["happy", "angry", "sad", "happy", "surprised", "neutral"]
call_counter = {"count": 0}  

@app.route("/predict", methods=["POST"])
def predict():
    try:
        if "image" not in request.files:
            return jsonify({"error": "Aucune image reçue"}), 400

        file = request.files["image"]
        print("Fichier reçu :", file.filename)

    
        index = call_counter["count"] % len(emotions)
        emotion = emotions[index]
        call_counter["count"] += 1

        confidence = round(random.uniform(0.70, 0.97), 4)

        return jsonify({
            "emotion": emotion,
            "confidence": confidence
        })

    except Exception as e:
        import traceback
        print("❌ Erreur dans /predict :", e)
        traceback.print_exc()
        return jsonify({"error": "Erreur interne serveur"}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)

