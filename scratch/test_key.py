import google.generativeai as genai
import os
import sys

api_key = "AIzaSyCeDBT19M8ruYIIKSLYUOliYFgVExrlfU4"

try:
    genai.configure(api_key=api_key)
    print("Available models:")
    for m in genai.list_models():
        if 'generateContent' in m.supported_generation_methods:
            print(m.name)
except Exception as e:
    print(f"Error occurred: {e}", file=sys.stderr)
