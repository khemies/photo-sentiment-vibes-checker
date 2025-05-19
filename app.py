from flask import Flask, request, jsonify
import tensorflow as tf
import numpy as np
 
app = Flask(__name__)
 
model = tf.keras.models.load_model("emotion_cnn.h5")
 
@app.route("/predict", methods=["POST"])
def predict():
    file = request.files["image"]
    img = tf.keras.preprocessing.image.load_img(file, target_size=(48, 48), color_mode="grayscale")
    img = np.array(img) / 255.0
    img = np.expand_dims(img, axis=0)
 
    prediction = model.predict(img)
    emotion = np.argmax(prediction)
 
    return jsonify({"emotion": int(emotion)})
 
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
 