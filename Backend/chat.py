from flask import Flask, request, jsonify
from langchain_google_genai import ChatGoogleGenerativeAI
import os
import sqlite3


app = Flask(__name__)


os.environ["GOOGLE_API_KEY"] = "AIzaSyCH_6wNl9l5JjiHbxSLrbTj0q10EaI7ZN8"
llm = ChatGoogleGenerativeAI(
    model="gemini-pro",
    temperature=0,
)

DATABASE = 'chat_history.db'

def init_db():
    with sqlite3.connect(DATABASE) as conn:
        cursor = conn.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS chat_history (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_message TEXT NOT NULL,
                ai_response TEXT NOT NULL
            )
        ''')
        conn.commit()

@app.route('/chat', methods=['POST'])
def chat():
    user_message = request.json.get('message')
    response = get_text_response(user_message)
    
    # Store the conversation in the database
    store_conversation(user_message, response)
    
    return jsonify({'response': response})

def get_text_response(user_message):
    prompt_value = f"You are a Medicine Expert bot \nHuman: {user_message} \nAI:"
    response = llm.predict(prompt_value)
    return response

def store_conversation(user_message, ai_response):
    with sqlite3.connect(DATABASE) as conn:
        cursor = conn.cursor()
        cursor.execute('INSERT INTO chat_history (user_message, ai_response) VALUES (?, ?)', (user_message, ai_response))
        conn.commit()

@app.route('/history', methods=['GET'])
def history():
    with sqlite3.connect(DATABASE) as conn:
        cursor = conn.cursor()
        cursor.execute('SELECT user_message, ai_response FROM chat_history')
        rows = cursor.fetchall()
        return jsonify(rows)


init_db()

if __name__ == '__main__':
    app.run(debug=True , port=5001)

