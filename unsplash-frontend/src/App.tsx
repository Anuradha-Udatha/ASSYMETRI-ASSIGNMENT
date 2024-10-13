// src/App.tsx
import React from 'react';
import ImageGallery from './ImageGallery';

const App: React.FC = () => {
  return (
    <div>
      <h1>Infinite Scroll Image Gallery</h1>
      <ImageGallery />
    </div>
  );
};

export default App;
