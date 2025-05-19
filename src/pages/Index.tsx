
import React, { useState } from 'react';
import Header from '@/components/Header';
import ImageUploader from '@/components/ImageUploader';
import EmotionResult, { EmotionData } from '@/components/EmotionResult';
import HistoryList from '@/components/HistoryList';
import { analyzeImage } from '@/services/sentimentAnalysis';
import { toast } from '@/components/ui/sonner';
import { v4 as uuidv4 } from 'uuid';

interface HistoryItem {
  id: string;
  imageUrl: string;
  result: EmotionData;
  timestamp: Date;
}

const Index = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<EmotionData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const handleImageSelected = async (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setIsLoading(true);
    setAnalysisResult(null);
    
    try {
      const result = await analyzeImage(imageUrl);
      setAnalysisResult(result);
      
      // Ajouter à l'historique
      const historyItem: HistoryItem = {
        id: uuidv4(),
        imageUrl,
        result,
        timestamp: new Date()
      };
      
      setHistory(prevHistory => [historyItem, ...prevHistory]);
    } catch (error) {
      console.error('Erreur lors de l\'analyse:', error);
      toast.error("Une erreur est survenue lors de l'analyse");
    } finally {
      setIsLoading(false);
    }
  };

  const handleHistoryItemClick = (item: HistoryItem) => {
    setSelectedImage(item.imageUrl);
    setAnalysisResult(item.result);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <Header />
        
        <div className="grid gap-8 md:gap-12 mt-8">
          {!selectedImage ? (
            <ImageUploader onImageSelected={handleImageSelected} />
          ) : (
            <div className="grid gap-8">
              <EmotionResult 
                imageUrl={selectedImage} 
                result={analysisResult}
                loading={isLoading}
              />
              
              {!isLoading && (
                <div className="flex justify-center">
                  <button 
                    onClick={() => setSelectedImage(null)}
                    className="text-primary hover:underline font-medium"
                  >
                    Analyser une nouvelle image
                  </button>
                </div>
              )}
            </div>
          )}
          
          <HistoryList items={history} onItemClick={handleHistoryItemClick} />
        </div>
      </div>
    </div>
  );
};

export default Index;
