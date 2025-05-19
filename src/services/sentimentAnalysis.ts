
import type { EmotionData, Emotion } from '@/components/EmotionResult';

// Simule une analyse d'émotion avec un délai artificiel 
// À remplacer par votre vrai modèle deep learning
export const analyzeImage = async (imageUrl: string): Promise<EmotionData> => {
  // Simule un temps de traitement
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Génère un résultat aléatoire pour la démonstration
  const emotions: Emotion[] = ['happy', 'sad', 'angry', 'neutral', 'surprised'];
  const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
  
  // Génère un score de confiance aléatoire entre 0.5 et 0.95
  const score = 0.5 + Math.random() * 0.45;
  
  return {
    emotion: randomEmotion,
    score
  };
};
