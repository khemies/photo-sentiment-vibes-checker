from flask import Flask, request, jsonify
import tensorflow as tf
import numpy as np
import boto3
import os

app = Flask(__name__)

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

@app.route("/predict", methods=["POST"])
def predict():
    file = request.files["image"]
    img = tf.keras.preprocessing.image.load_img(file, target_size=(48, 48), color_mode="grayscale")
    img = np.array(img) / 255.0
    img = np.expand_dims(img, axis=0)

    prediction = model.predict(img)
    emotion = int(np.argmax(prediction))

    return jsonify({"emotion": emotion})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
