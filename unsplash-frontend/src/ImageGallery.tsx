// src/ImageGallery.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Masonry from 'react-responsive-masonry';
import './ImageGallery.css'; // Add your CSS styles here

interface Image {
  id: string; // Assuming 'id' is unique for each image
  urls: {
    small: string;
    regular: string;
  };
  alt_description: string;
}

const ImageGallery: React.FC = () => {
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [popupImage, setPopupImage] = useState<string | null>(null);

  const fetchImages = async () => {
    setLoading(true);
    try {
      console.log(`Fetching images for page: ${page}`); // Log current page
      const response = await axios.get(`http://localhost:5000/api/images?page=${page}`);
      console.log(`Fetched images for page ${page}:`, response.data); // Log response data
      setImages((prevImages: Image[]) => [...prevImages, ...response.data]); // Specify type for prevImages
      setPage((prevPage: number) => prevPage + 1); // Specify type for prevPage
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages(); // Initial fetch on component mount
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (loading) return; // Prevent fetching if already loading
      if (
        window.innerHeight + document.documentElement.scrollTop + 50 >=
        document.documentElement.scrollHeight
      ) {
        fetchImages(); // Fetch more images when scrolled to the bottom
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll); // Cleanup listener on unmount
  }, [loading]); // Add loading as a dependency

  return (
    <div className="gallery"> {/* Add the gallery class here */}
      <Masonry columnsCount={3} gutter="10px">
        {images.map((image: Image, index: number) => ( // Specify type for image and use index
          <img
            key={`${image.id}-${page}-${index}`} // Create a unique key by combining id, page, and index
            src={image.urls.small}
            alt={image.alt_description || 'Unsplash Image'}
            onClick={() => setPopupImage(image.urls.regular)} // Open image in popup
            className="gallery-image" // Use the class for styling
          />
        ))}
      </Masonry>
      {loading && <p className="loading-text">Loading more images...</p>}
      {popupImage && (
        <div className="popup" onClick={() => setPopupImage(null)}>
          <img src={popupImage} alt="Popup" />
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
