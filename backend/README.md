
# Flask Backend for Daily Task to Smart Notes Converter

This backend provides AI-powered functionality for the Daily Task to Smart Notes Converter app using Google's Gemini API.

## Setup Instructions

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Set up your environment variables:
```bash
cp .env.example .env
```
Then edit the `.env` file to add your Gemini API key.

3. Run the Flask application:
```bash
python app.py
```

The server will start on http://127.0.0.1:5000

## API Endpoints

- **POST /api/quote**
  - Gets a motivational quote based on the language
  - Body: `{ "language": "en" }`
  - Response: `{ "quote": "Your motivational quote here" }`

- **POST /api/break-suggestion**
  - Gets a productivity break suggestion
  - Body: `{ "language": "en" }`
  - Response: `{ "suggestion": "Your break suggestion here" }`

## Additional Information

- The app will use fallback quotes if the API key is not set or if the API request fails
- You can get a Gemini API key from https://ai.google.dev/
