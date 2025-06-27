export interface EmotionData {
  emotion: string;
  score: number;
}

export function base64ToFile(dataurl: string, filename: string): File {
  const arr = dataurl.split(',');
  const mimeMatch = arr[0].match(/:(.*?);/);
  if (!mimeMatch) throw new Error("Impossible d'extraire le type MIME");
  const mime = mimeMatch[1];
  const bstr = atob(arr[1]);
  const u8arr = new Uint8Array(bstr.length);

  for (let i = 0; i < bstr.length; i++) {
    u8arr[i] = bstr.charCodeAt(i);
  }

  return new File([u8arr], filename, { type: mime });
}

// Envoie le fichier image au backend Flask pour l'analyse des émotions
export const analyzeImage = async (file: File): Promise<EmotionData> => {
  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch("http://51.44.52.100:5000/predict", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const msg = await response.text();
    throw new Error("Erreur serveur : " + response.statusText + "\n" + msg);
  }

  const result = await response.json();

  const { emotion, confidence } = result;

  if (typeof emotion !== 'string' || typeof confidence !== 'number') {
    throw new Error("Réponse invalide de l'API");
  }

  return {
    emotion,
    score: confidence
  };
};
