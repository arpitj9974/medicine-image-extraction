import google.generativeai as genai
import os
from dotenv import load_dotenv

# Try to load from python-ai-service/.env
load_dotenv("python-ai-service/.env")
api_key = os.getenv("GEMINI_API_KEY")

print(f"API Key found: {bool(api_key)}")

if api_key:
    genai.configure(api_key=api_key)
    try:
        for m in genai.list_models():
            if 'generateContent' in m.supported_generation_methods:
                print(m.name)
    except Exception as e:
        print(f"Error: {e}")
else:
    print("No GEMINI_API_KEY found in python-ai-service/.env")
