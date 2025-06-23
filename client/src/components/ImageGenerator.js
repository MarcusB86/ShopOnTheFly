import React, { useState } from 'react';
import './ImageGenerator.css';

const ImageGenerator = ({ onImageGenerated, productName, productDescription }) => {
  const [prompt, setPrompt] = useState('');
  const [generating, setGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState([]);

  // Generate a default prompt based on product info
  const generateDefaultPrompt = () => {
    if (productName && productDescription) {
      return `Professional product photography of ${productName}: ${productDescription}, clean background, high quality, commercial use`;
    }
    return '';
  };

  const handleGenerateImage = async () => {
    setGenerating(true);
    
    try {
      // Option 1: Using Unsplash API (free, real photos)
      const unsplashResponse = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(prompt || productName)}&per_page=5`,
        {
          headers: {
            'Authorization': `Client-ID YOUR_UNSPLASH_ACCESS_KEY`
          }
        }
      );
      
      if (unsplashResponse.ok) {
        const data = await unsplashResponse.json();
        const images = data.results.map(photo => ({
          url: photo.urls.regular,
          alt: photo.alt_description,
          source: 'Unsplash'
        }));
        setGeneratedImages(images);
      }
      
      // Option 2: Using placeholder services (for development)
      const placeholderImages = [
        `https://via.placeholder.com/400x400/2563eb/ffffff?text=${encodeURIComponent(productName || 'Product')}`,
        `https://picsum.photos/400/400?random=${Math.random()}`,
        `https://source.unsplash.com/400x400/?${encodeURIComponent(prompt || productName || 'product')}`
      ];
      
      setGeneratedImages(placeholderImages.map((url, index) => ({
        url,
        alt: `${productName || 'Product'} ${index + 1}`,
        source: 'Placeholder'
      })));
      
    } catch (error) {
      console.error('Error generating images:', error);
    } finally {
      setGenerating(false);
    }
  };

  const handleSelectImage = (imageUrl) => {
    onImageGenerated(imageUrl);
  };

  return (
    <div className="image-generator">
      <h3>Generate Product Images</h3>
      
      <div className="prompt-section">
        <label htmlFor="prompt">Image Description:</label>
        <textarea
          id="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={generateDefaultPrompt()}
          className="form-input"
          rows="3"
        />
        <button 
          onClick={handleGenerateImage}
          disabled={generating}
          className="btn btn-primary"
        >
          {generating ? 'Generating...' : 'Generate Images'}
        </button>
      </div>

      {generatedImages.length > 0 && (
        <div className="generated-images">
          <h4>Generated Images:</h4>
          <div className="image-grid">
            {generatedImages.map((image, index) => (
              <div key={index} className="image-option">
                <img 
                  src={image.url} 
                  alt={image.alt}
                  onClick={() => handleSelectImage(image.url)}
                  className="generated-image"
                />
                <button 
                  onClick={() => handleSelectImage(image.url)}
                  className="btn btn-sm btn-primary select-btn"
                >
                  Use This Image
                </button>
                <small className="image-source">{image.source}</small>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="image-sources">
        <h4>Image Sources:</h4>
        <ul>
          <li><strong>Unsplash:</strong> Free high-quality stock photos</li>
          <li><strong>Picsum:</strong> Random placeholder images</li>
          <li><strong>Placeholder.com:</strong> Custom placeholder images</li>
          <li><strong>AI Services:</strong> DALL-E, Midjourney, Stable Diffusion</li>
        </ul>
      </div>
    </div>
  );
};

export default ImageGenerator; 