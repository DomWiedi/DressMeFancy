const express = require('express');
const fetch = require('node-fetch');
const FormData = require('form-data');
const app = express();
const port = 3000;

// Load environment variables from .env file
require('dotenv').config();

// Middleware to parse JSON bodies
app.use(express.json({ limit: '50mb' }));

// Serve static files from the project directory
app.use(express.static(__dirname));

app.post('/process-image', async (req, res) => {
    try {
        const base64Image = req.body.image;

        // Convert base64 to binary
        const binaryImage = Buffer.from(base64Image, 'base64');

        const formData = new FormData();
        formData.append('file', binaryImage, {
            contentType: 'image/jpeg',
            filename: 'upload.jpg'
        });

        const response = await fetch('https://api-inference.huggingface.co/models/Kwai-Kolors/Kolors-Virtual-Try-On', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.HUGGING_FACE_API_TOKEN}`
            },
            body: formData
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }

        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        res.writeHead(200, {
            'Content-Type': response.headers.get('Content-Type'),
            'Content-Length': buffer.length
        });
        res.end(buffer);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('An error occurred while processing the image.');
    }
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running at http://localhost:${port}`);
});
