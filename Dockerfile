FROM python:3.9
 
WORKDIR /app
 
COPY emotion_cnn.h5 .
COPY requirements.txt .
 
RUN pip install -r requirements.txt
 
COPY app.py .
CMD ["python3", "app.py"]