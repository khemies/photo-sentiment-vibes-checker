import React, { useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';
import { Upload, Camera } from 'lucide-react';

interface ImageUploaderProps {
  onImageSelected: (file: File) => void;
}

// Utilitaire : base64 → File
function base64ToFile(dataUrl: string, filename: string): File {
  const arr = dataUrl.split(',');
  const mimeMatch = arr[0].match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : 'image/png';
  const bstr = atob(arr[1]);
  const u8arr = new Uint8Array(bstr.length);

  for (let i = 0; i < bstr.length; i++) {
    u8arr[i] = bstr.charCodeAt(i);
  }

  return new File([u8arr], filename, { type: mime });
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelected }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
      e.target.value = '';
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error("Veuillez sélectionner une image valide");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target && typeof event.target.result === 'string') {
        const fileConverted = base64ToFile(event.target.result, file.name);
        onImageSelected(fileConverted); // Passe un vrai fichier File
      }
    };
    reader.readAsDataURL(file);
  };

  const startCamera = async () => {
    try {
      setIsCapturing(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Erreur lors de l'accès à la caméra:", err);
      toast.error("Impossible d'accéder à la caméra");
      setIsCapturing(false);
    }
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageUrl = canvas.toDataURL('image/png');
        const fileFromCanvas = base64ToFile(imageUrl, "webcam-capture.png");
        onImageSelected(fileFromCanvas); // Passe un vrai fichier File

        const stream = video.srcObject as MediaStream;
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }
        setIsCapturing(false);
      }
    }
  };

  const cancelCapture = () => {
    if (videoRef.current) {
      const stream = videoRef.current.srcObject as MediaStream;
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      setIsCapturing(false);
    }
  };

  return (
    <Card className="w-full max-w-xl mx-auto">
      <CardContent className="p-6">
        {!isCapturing ? (
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
              isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/20'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="mb-4">
              <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center mb-4">
                <Upload className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium">Déposez votre image ici</h3>
              <p className="text-muted-foreground text-sm mt-1">
                ou cliquez pour sélectionner un fichier (PNG, JPG)
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                Importer une image
              </Button>
              <Button
                onClick={startCamera}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Camera className="h-4 w-4" />
                Utiliser la caméra
              </Button>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleFileSelect}
            />
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <video 
              ref={videoRef} 
              autoPlay 
              className="rounded-lg max-h-[400px] mb-4"
            />
            <canvas ref={canvasRef} className="hidden" />
            <div className="flex gap-3">
              <Button onClick={captureImage} variant="default">
                Prendre une photo
              </Button>
              <Button onClick={cancelCapture} variant="outline">
                Annuler
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ImageUploader;
