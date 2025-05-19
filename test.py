import boto3
from dotenv import load_dotenv
import os

load_dotenv()

AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID", "").strip()
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY", "").strip()

BUCKET_NAME = "iacloud-detection-emotions"
MODEL_KEY = "emotion_cnn.h5"
LOCAL_FILE = "test_download.h5"

if not AWS_ACCESS_KEY_ID or not AWS_SECRET_ACCESS_KEY:
    print("Les clés AWS sont manquantes.")
    exit()

s3 = boto3.client("s3",
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY
)

try:
    s3.download_file(BUCKET_NAME, MODEL_KEY, LOCAL_FILE)
    print(f"Modèle téléchargé avec succès sous : {LOCAL_FILE}")
except Exception as e:
    print("Erreur lors du téléchargement :", e)

