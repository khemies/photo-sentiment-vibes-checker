FROM python:3.9-slim

WORKDIR /app

COPY app.py emotion_cnn.h5 requirements.txt ./

RUN pip install --upgrade pip && pip install -r requirements.txt

EXPOSE 5000

CMD ["python", "app.py"]
