const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

// API route to fetch images with pagination
app.get('/api/images', async (req, res) => {
  const page = req.query.page || 1;  // Defaults to page 1 if no page query is provided

  try {
    // Request to Unsplash API with correct pagination parameters
    const response = await axios.get('https://api.unsplash.com/photos', {
      params: {
        client_id: process.env.UNSPLASH_ACCESS_KEY,  // Access key from .env
        page: page,    // The requested page number
        per_page: 25   // Set to fetch 25 images per page
      }
    });

    // Send only 25 images back to the frontend
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching images from Unsplash:', error);
    res.status(500).json({ error: 'Unable to fetch images' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
