
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

export type Emotion = 'happy' | 'sad' | 'angry' | 'neutral' | 'surprised';

export interface EmotionData {
  emotion: Emotion;
  score: number;
}

interface EmotionResultProps {
  imageUrl: string;
  result: EmotionData | null;
  loading: boolean;
}

const emotionLabels: Record<Emotion, string> = {
  happy: 'Joie',
  sad: 'Tristesse',
  angry: 'Colère',
  neutral: 'Neutre',
  surprised: 'Surprise'
};

const emotionEmojis: Record<Emotion, string> = {
  happy: '😊',
  sad: '😢',
  angry: '😡',
  neutral: '😐',
  surprised: '😲'
};

const EmotionResult: React.FC<EmotionResultProps> = ({ imageUrl, result, loading }) => {
  const getPredominantEmotion = () => {
    if (!result) return null;
    return emotionLabels[result.emotion];
  };

  return (
    <Card className="w-full max-w-xl mx-auto overflow-hidden animate-fade-in">
      <div className="aspect-video w-full relative overflow-hidden">
        <img 
          src={imageUrl} 
          alt="Uploaded" 
          className="w-full h-full object-cover"
        />
      </div>
      
      <CardContent className="p-6">
        {loading ? (
          <div className="flex flex-col items-center py-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-gradient-emotion animate-pulse-soft"></div>
            <p className="text-lg font-medium">Analyse en cours...</p>
          </div>
        ) : result ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold">Résultat de l'analyse</h3>
              <span className="text-3xl" role="img" aria-label={result.emotion}>
                {emotionEmojis[result.emotion]}
              </span>
            </div>
            
            <div className="bg-muted/20 p-4 rounded-lg">
              <p className="text-lg mb-2">
                Émotion prédominante: <span className="font-bold">{getPredominantEmotion()}</span>
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                Score de confiance: {Math.round(result.score * 100)}%
              </p>
              
              <Progress 
                value={result.score * 100} 
                className={cn(
                  "h-2 w-full",
                  result.emotion === 'happy' && "bg-emotion-happy/20 [&>div]:bg-emotion-happy",
                  result.emotion === 'sad' && "bg-emotion-sad/20 [&>div]:bg-emotion-sad",
                  result.emotion === 'angry' && "bg-emotion-angry/20 [&>div]:bg-emotion-angry",
                  result.emotion === 'neutral' && "bg-emotion-neutral/20 [&>div]:bg-emotion-neutral",
                  result.emotion === 'surprised' && "bg-emotion-surprised/20 [&>div]:bg-emotion-surprised"
                )}
              />
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
};

export default EmotionResult;
