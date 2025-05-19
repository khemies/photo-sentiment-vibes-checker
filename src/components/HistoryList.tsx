
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { EmotionData } from './EmotionResult';

interface HistoryItem {
  id: string;
  imageUrl: string;
  result: EmotionData;
  timestamp: Date;
}

interface HistoryListProps {
  items: HistoryItem[];
  onItemClick: (item: HistoryItem) => void;
}

const HistoryList: React.FC<HistoryListProps> = ({ items, onItemClick }) => {
  if (items.length === 0) {
    return null;
  }
  
  return (
    <Card className="w-full max-w-xl mx-auto mt-8">
      <CardContent className="p-4">
        <h3 className="text-lg font-medium mb-3">Historique d'analyses</h3>
        <ScrollArea className="h-[180px]">
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
            {items.map((item) => (
              <div 
                key={item.id} 
                className="cursor-pointer relative group overflow-hidden"
                onClick={() => onItemClick(item)}
              >
                <div className="aspect-square rounded-md overflow-hidden">
                  <img 
                    src={item.imageUrl} 
                    alt={`Analyse: ${item.result.emotion}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white font-medium text-sm">
                    {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default HistoryList;
