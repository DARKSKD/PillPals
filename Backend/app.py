from flask import Flask, request, jsonify
from langchain_google_genai import ChatGoogleGenerativeAI
import os

app = Flask(__name__)

os.environ["GOOGLE_API_KEY"] = "AIzaSyCH_6wNl9l5JjiHbxSLrbTj0q10EaI7ZN8"
llm = ChatGoogleGenerativeAI(
    model="gemini-pro",
    temperature=0,
)

def get_text_response(user_message):
    prompt_value = f"You are a Pharmacist Bot. Provide a **concise list** of Symptoms primarily treated by {user_message}. **No descriptions, no side effects, no dosage information—only the Symptom names.** \n\nHuman: {user_message}\nAI:"
    response = llm.predict(prompt_value)
    return response

@app.route('/used-for', methods=['GET'])
def used_for():
    medication = request.args.get('medication')
    response = get_text_response(medication)
    return jsonify({'usedFor': response})

if __name__ == '__main__':
    app.run(debug=True , port=5000)
