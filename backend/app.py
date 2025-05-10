
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
    # ... keep existing code (quote generation)

@app.route('/api/break-suggestion', methods=['POST'])
def get_break_suggestion():
    # ... keep existing code (break suggestion)

@app.route('/api/determine-priority', methods=['POST'])
def determine_priority():
    data = request.json
    task_content = data.get('taskContent', '')
    language_code = data.get('language', 'en')
    
    if not task_content:
        return jsonify({
            "priority": "medium",
            "explanation": "No task content provided. Default priority assigned."
        })
    
    prompt_by_language = {
        'en': f"Given the task: '{task_content}', determine its priority as 'low', 'medium', or 'high'. Consider task urgency, importance, and complexity. Respond with just a JSON object with two fields: 'priority' which is one of: 'low', 'medium', or 'high', and 'explanation' which is a short explanation of why you chose that priority.",
        'es': f"Dada la tarea: '{task_content}', determina su prioridad como 'baja', 'media', o 'alta'. Considera la urgencia, importancia y complejidad de la tarea. Responde con un objeto JSON con dos campos: 'priority' que es uno de: 'low', 'medium', o 'high', y 'explanation' que es una breve explicación de por qué elegiste esa prioridad.",
        'hi': f"कार्य के आधार पर: '{task_content}', इसकी प्राथमिकता 'निम्न', 'मध्यम', या 'उच्च' के रूप में निर्धारित करें। कार्य की तात्कालिकता, महत्व और जटिलता पर विचार करें। केवल एक JSON ऑब्जेक्ट के साथ उत्तर दें जिसमें दो फील्ड हों: 'priority' जो इनमें से एक है: 'low', 'medium', या 'high', और 'explanation' जो एक संक्षिप्त स्पष्टीकरण है कि आपने वह प्राथमिकता क्यों चुनी।"
    }
    
    prompt = prompt_by_language.get(language_code, prompt_by_language['en'])
    
    try:
        response = model.generate_content(prompt)
        response_text = response.text.strip()
        
        # Try to extract the JSON part if it's wrapped in ``` or other markers
        import json
        import re
        
        # Find JSON-like structures in the response
        json_match = re.search(r'\{.*?\}', response_text, re.DOTALL)
        if json_match:
            try:
                result = json.loads(json_match.group(0))
                # Ensure the result contains valid priority
                if "priority" in result and result["priority"] in ["low", "medium", "high"]:
                    return jsonify(result)
            except json.JSONDecodeError:
                pass
                
        # If we can't parse JSON or the priority is invalid, fall back to a simpler approach
        priority_mapping = {
            "low": ["low", "baja", "निम्न"],
            "medium": ["medium", "media", "मध्यम"],
            "high": ["high", "alta", "उच्च"]
        }
        
        for priority, keywords in priority_mapping.items():
            if any(keyword in response_text.lower() for keyword in keywords):
                return jsonify({
                    "priority": priority,
                    "explanation": "Based on AI analysis of the task content."
                })
        
        # Default fallback
        return jsonify({
            "priority": "medium",
            "explanation": "AI couldn't determine priority clearly. Medium priority assigned by default."
        })
        
    except Exception as e:
        print(f"Error determining priority: {e}")
        return jsonify({
            "priority": "medium",
            "explanation": "Error in AI processing. Default priority assigned.",
            "error": str(e)
        })

if __name__ == '__main__':
    app.run(debug=True)
