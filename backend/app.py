
from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configure the Gemini API
API_KEY = os.getenv("GEMINI_API_KEY")
if not API_KEY:
    print("Warning: GEMINI_API_KEY not set in environment variables. Using placeholder.")
    # This will not work without a real API key
    API_KEY = "YOUR_GEMINI_API_KEY"

genai.configure(api_key=API_KEY)

# Set up the model
generation_config = {
    "temperature": 0.7,
    "top_p": 0.95,
    "top_k": 40,
    "max_output_tokens": 100,
}

safety_settings = [
    {
        "category": "HARM_CATEGORY_HARASSMENT",
        "threshold": "BLOCK_MEDIUM_AND_ABOVE"
    },
    {
        "category": "HARM_CATEGORY_HATE_SPEECH",
        "threshold": "BLOCK_MEDIUM_AND_ABOVE"
    },
    {
        "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
        "threshold": "BLOCK_MEDIUM_AND_ABOVE"
    },
    {
        "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
        "threshold": "BLOCK_MEDIUM_AND_ABOVE"
    },
]

model = genai.GenerativeModel(
    model_name="gemini-1.0-pro",
    generation_config=generation_config,
    safety_settings=safety_settings
)

@app.route('/api/quote', methods=['POST'])
def get_quote():
    data = request.json
    language_code = data.get('language', 'en')
    
    prompt_by_language = {
        'en': "Generate a short motivational quote (less than 15 words) for productivity.",
        'es': "Genera una breve cita motivacional (menos de 15 palabras) para la productividad.",
        'hi': "उत्पादकता के लिए एक छोटा प्रेरक उद्धरण (15 शब्दों से कम) उत्पन्न करें।",
        # Add other languages as needed
    }
    
    prompt = prompt_by_language.get(language_code, prompt_by_language['en'])
    
    try:
        response = model.generate_content(prompt)
        quote = response.text.strip('"').strip()
        
        # Remove excess formatting like markdown or newlines
        quote = quote.replace('*', '').replace('#', '').strip()
        
        return jsonify({"quote": quote})
    except Exception as e:
        print(f"Error generating quote: {e}")
        return jsonify({
            "quote": "Every moment is a fresh beginning.",
            "error": str(e)
        }), 500

@app.route('/api/break-suggestion', methods=['POST'])
def get_break_suggestion():
    data = request.json
    language_code = data.get('language', 'en')
    
    prompt_by_language = {
        'en': "Generate a brief productivity break suggestion.",
        'es': "Genera una breve sugerencia de descanso para la productividad.",
        'hi': "उत्पादकता विराम के लिए एक संक्षिप्त सुझाव उत्पन्न करें।",
        # Add other languages as needed
    }
    
    prompt = prompt_by_language.get(language_code, prompt_by_language['en'])
    
    try:
        response = model.generate_content(prompt)
        suggestion = response.text.strip('"').strip()
        
        # Remove excess formatting
        suggestion = suggestion.replace('*', '').replace('#', '').strip()
        
        return jsonify({"suggestion": suggestion})
    except Exception as e:
        print(f"Error generating break suggestion: {e}")
        return jsonify({
            "suggestion": "Take a 5-minute walk to refresh your mind.",
            "error": str(e)
        }), 500

if __name__ == '__main__':
    app.run(debug=True)
