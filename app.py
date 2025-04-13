import os
import sys
from flask import Flask, request, jsonify, render_template
import replicate
from dotenv import load_dotenv
import requests
import time

# Load environment variables
load_dotenv()

# Print debug information
replicate_api_token = os.getenv("REPLICATE_API_TOKEN")
print(f"Replicate API Token found: {'Yes' if replicate_api_token else 'No'}")
if replicate_api_token:
    print(f"API Token starts with: {replicate_api_token[:8]}...")

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/generate-image', methods=['POST'])
def generate_image():
    try:
        data = request.json
        prompt = data.get('prompt', '')
        
        if not prompt:
            return jsonify({'error': 'Prompt is required'}), 400
            
        print(f"Processing prompt: {prompt[:50]}...")
        
        # Use Replicate API to generate the image
        # This uses Stability AI's Stable Diffusion model
        output = replicate.run(
            "stability-ai/sdxl:c221b2b8ef527988fb59bf24a8b97c4561f1c671f73bd389f866bfb27c061316",
            input={
                "prompt": prompt,
                "negative_prompt": "low quality, bad anatomy, bad hands, cropped head",
                "width": 1024,
                "height": 1024,
                "num_outputs": 1,
                "scheduler": "K_EULER",
                "num_inference_steps": 30
            }
        )
        
        # Replicate returns an array of image URLs
        image_url = output[0] if output and len(output) > 0 else None
        
        if not image_url:
            return jsonify({'error': 'Failed to generate image'}), 500
            
        print(f"Image generated successfully: {image_url[:50]}...")
        
        return jsonify({
            'success': True,
            'image_url': image_url
        })
    except Exception as e:
        error_message = str(e)
        print(f"Error generating image: {error_message}")
        return jsonify({'error': error_message}), 500

if __name__ == '__main__':
    print("Starting Flask application...")
    app.run(debug=True)    