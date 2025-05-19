
import React from 'react';

const Header = () => {
  return (
    <div className="text-center mb-8">
      <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-emotion animate-fade-in">
        Analyse de Sentiment
      </h1>
      <p className="mt-3 text-muted-foreground max-w-2xl mx-auto text-lg">
        Découvrez les émotions capturées dans vos photos grâce à notre technologie d'intelligence artificielle
      </p>
    </div>
  );
};

export default Header;
