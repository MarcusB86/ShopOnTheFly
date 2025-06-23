# 🎨 Image Generation Guide for Shop On The Fly

This guide covers various methods to generate product images for your ecommerce application.

## 🚀 **Quick Start Options**

### 1. **Free Stock Photo Services** (Recommended for Development)

#### **Unsplash API** (Free)
```javascript
// Get free high-quality photos
const response = await fetch(
  `https://api.unsplash.com/search/photos?query=${productName}&per_page=5`,
  {
    headers: {
      'Authorization': `Client-ID YOUR_UNSPLASH_ACCESS_KEY`
    }
  }
);
```

**Setup:**
1. Sign up at [unsplash.com/developers](https://unsplash.com/developers)
2. Create an application to get your API key
3. Add the key to your environment variables

#### **Pexels API** (Free)
```javascript
// Alternative free stock photos
const response = await fetch(
  `https://api.pexels.com/v1/search?query=${productName}&per_page=5`,
  {
    headers: {
      'Authorization': 'YOUR_PEXELS_API_KEY'
    }
  }
);
```

### 2. **Placeholder Services** (For Development)

#### **Dynamic Placeholders**
```javascript
// Custom placeholder with product name
const placeholderUrl = `https://via.placeholder.com/400x400/2563eb/ffffff?text=${encodeURIComponent(productName)}`;

// Random images
const randomImage = `https://picsum.photos/400/400?random=${Math.random()}`;

// Unsplash random
const unsplashRandom = `https://source.unsplash.com/400x400/?${encodeURIComponent(productName)}`;
```

## 🤖 **AI Image Generation Services**

### 1. **OpenAI DALL-E** (Paid)
```javascript
const response = await fetch('https://api.openai.com/v1/images/generations', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${OPENAI_API_KEY}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    prompt: `Professional product photography of ${productName}: ${description}, clean white background, high quality, commercial use`,
    n: 4,
    size: '1024x1024'
  })
});
```

**Setup:**
1. Get API key from [platform.openai.com](https://platform.openai.com)
2. Add to environment variables
3. Cost: ~$0.02 per image

### 2. **Stability AI** (Paid)
```javascript
const response = await fetch('https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${STABILITY_API_KEY}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    text_prompts: [{
      text: `Professional product photography of ${productName}`,
      weight: 1
    }],
    cfg_scale: 7,
    height: 1024,
    width: 1024,
    samples: 4
  })
});
```

### 3. **Midjourney** (Paid)
- Use Discord bot or API
- Excellent quality but more expensive
- Best for high-end product photography

## 🛠️ **Implementation Options**

### **Option 1: Integrated Image Generator** (Current Implementation)
- Built into the admin form
- Generates multiple options
- User can select and preview
- Works with any image service

### **Option 2: External Image Service**
```javascript
// Backend route for image generation
app.post('/api/generate-image', async (req, res) => {
  const { prompt, service } = req.body;
  
  try {
    let imageUrl;
    
    switch(service) {
      case 'unsplash':
        imageUrl = await generateUnsplashImage(prompt);
        break;
      case 'dalle':
        imageUrl = await generateDalleImage(prompt);
        break;
      default:
        imageUrl = await generatePlaceholderImage(prompt);
    }
    
    res.json({ imageUrl });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate image' });
  }
});
```

### **Option 3: Batch Image Generation**
```javascript
// Generate images for all products without images
const productsWithoutImages = products.filter(p => !p.image_url);

for (const product of productsWithoutImages) {
  const imageUrl = await generateProductImage(product.name, product.description);
  await updateProductImage(product.id, imageUrl);
}
```

## 📋 **Recommended Setup for Production**

### **Environment Variables**
```bash
# .env
UNSPLASH_ACCESS_KEY=your_unsplash_key
OPENAI_API_KEY=your_openai_key
STABILITY_API_KEY=your_stability_key
PEXELS_API_KEY=your_pexels_key
```

### **Image Generation Strategy**
1. **Development**: Use placeholder services (free)
2. **Testing**: Use Unsplash API (free, real photos)
3. **Production**: Use AI generation for custom products, stock photos for common items

### **Image Optimization**
```javascript
// Backend image processing
const sharp = require('sharp');

app.post('/api/optimize-image', upload.single('image'), async (req, res) => {
  const optimizedImage = await sharp(req.file.buffer)
    .resize(800, 800, { fit: 'inside' })
    .jpeg({ quality: 80 })
    .toBuffer();
    
  // Upload to cloud storage (AWS S3, Cloudinary, etc.)
  const imageUrl = await uploadToCloudStorage(optimizedImage);
  res.json({ imageUrl });
});
```

## 🎯 **Best Practices**

### **Prompt Engineering for AI**
```javascript
const generatePrompt = (productName, description, category) => {
  return `Professional product photography of ${productName}: ${description}, 
    ${category} category, clean white background, studio lighting, 
    high resolution, commercial use, no text or watermarks`;
};
```

### **Image Quality Standards**
- **Minimum size**: 400x400px
- **Recommended size**: 800x800px or 1024x1024px
- **Format**: JPEG for photos, PNG for graphics
- **File size**: Under 500KB for web optimization

### **Fallback Strategy**
```javascript
const getProductImage = (product) => {
  if (product.image_url) {
    return product.image_url;
  }
  
  // Fallback to category-based placeholder
  return `https://via.placeholder.com/400x400/2563eb/ffffff?text=${encodeURIComponent(product.category_name || 'Product')}`;
};
```

## 💰 **Cost Comparison**

| Service | Cost per Image | Quality | Best For |
|---------|---------------|---------|----------|
| Unsplash | Free | High | Stock photos |
| Pexels | Free | High | Stock photos |
| DALL-E | $0.02 | Very High | Custom products |
| Stability AI | $0.01 | High | Custom products |
| Midjourney | $0.10+ | Excellent | Premium products |

## 🚀 **Quick Implementation**

To use the current image generator:

1. **Login as admin**: `admin@shoponthefly.com` / `admin123`
2. **Go to Admin Panel**: Click "Admin" in navbar
3. **Create Product**: Fill out the form
4. **Generate Image**: Click "🎨 Generate Image" button
5. **Select Image**: Choose from generated options
6. **Save Product**: The image URL will be automatically added

The system currently uses placeholder services for development. For production, integrate with your preferred image service by updating the `ImageGenerator.js` component. 