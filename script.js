document.getElementById('upload-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const imageUpload = document.getElementById('image-upload').files[0];

    if (!imageUpload) {
        alert('Please select an image to upload.');
        return;
    }

    // Show a loading message
    document.getElementById('result').innerHTML = '<p>Processing image...</p>';

    // Read the image file
    const reader = new FileReader();
    reader.onloadend = function() {
        const base64data = reader.result.split(',')[1];

        // Send the image to the server
        fetch('/process-image', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ image: base64data })
        })
        .then(response => response.blob())
        .then(blob => {
            const imageUrl = URL.createObjectURL(blob);
            document.getElementById('result').innerHTML = '<h2>Result:</h2>';
            document.getElementById('output-image').src = imageUrl;
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while processing the image.');
        });
    };
    reader.readAsDataURL(imageUpload);
});
