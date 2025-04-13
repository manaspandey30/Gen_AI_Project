document.addEventListener('DOMContentLoaded', function() {
    const promptInput = document.getElementById('prompt');
    const generateBtn = document.getElementById('generateBtn');
    const loadingDiv = document.getElementById('loading');
    const resultDiv = document.getElementById('result');
    const generatedImage = document.getElementById('generatedImage');
    const errorDiv = document.getElementById('error');

    generateBtn.addEventListener('click', generateImage);

    async function generateImage() {
        const prompt = promptInput.value.trim();
        
        if (!prompt) {
            showError('Please enter a prompt');
            return;
        }

        // Show loading, hide results and errors
        loadingDiv.classList.remove('d-none');
        resultDiv.classList.add('d-none');
        errorDiv.classList.add('d-none');
        generateBtn.disabled = true;

        try {
            const response = await fetch('/generate-image', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ prompt })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to generate image');
            }

            if (data.success && data.image_url) {
                // Display the generated image
                generatedImage.src = data.image_url;
                resultDiv.classList.remove('d-none');
                
                // Scroll to the result
                resultDiv.scrollIntoView({ behavior: 'smooth' });
            } else {
                throw new Error('No image was returned');
            }
        } catch (error) {
            showError(error.message);
        } finally {
            loadingDiv.classList.add('d-none');
            generateBtn.disabled = false;
        }
    }

    function showError(message) {
        errorDiv.textContent = message;
        errorDiv.classList.remove('d-none');
    }
    
    // Add type-to-focus animation for the textarea
    promptInput.addEventListener('focus', function() {
        this.classList.add('active');
    });
    
    promptInput.addEventListener('blur', function() {
        if (!this.value) {
            this.classList.remove('active');
        }
    });
    
    // Initialize tooltips if Bootstrap 5 is used
    if (typeof bootstrap !== 'undefined') {
        const tooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]');
        tooltips.forEach(tooltip => {
            new bootstrap.Tooltip(tooltip);
        });
    }
});

// Functions for suggestion chips
function usePrompt(text) {
    document.getElementById('prompt').value = text;
    document.getElementById('prompt').focus();
}

// Function to download generated image
function downloadImage() {
    const image = document.getElementById('generatedImage');
    const link = document.createElement('a');
    link.href = image.src;
    link.download = 'ai-generated-image.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Function to regenerate image
function regenerateImage() {
    document.getElementById('generateBtn').click();
} 