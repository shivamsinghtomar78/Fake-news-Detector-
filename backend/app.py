from flask import Flask, request, jsonify
import pickle
import numpy as np
import nltk
from nltk.corpus import stopwords
from nltk.stem.porter import PorterStemmer
import re
from flask_cors import CORS  # Add this import for handling CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Initialize NLTK
nltk.download('stopwords')
port_stem = PorterStemmer()

# Load the trained model and vectorizer
try:
    with open('trained_model.pkl', 'rb') as file:
        model_data = pickle.load(file)
        model = model_data['model']
        vectorizer = model_data['vectorizer']
except FileNotFoundError:
    print("Error: trained_model.pkl not found. Make sure to train and save your model first.")
except Exception as e:
    print(f"Error loading model: {str(e)}")

def preprocess_text(content):
    # Stemming and cleaning
    stemmed_content = re.sub('[^a-zA-Z]', ' ', content)
    stemmed_content = stemmed_content.lower()
    stemmed_content = stemmed_content.split()
    stemmed_content = [port_stem.stem(word) for word in stemmed_content if not word in stopwords.words('english')]
    stemmed_content = ' '.join(stemmed_content)
    return stemmed_content

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        content = data['content']
        
        # Preprocess the input
        processed_content = preprocess_text(content)
        
        # Vectorize the input
        X = vectorizer.transform([processed_content])
        
        # Predict
        prediction = model.predict(X)
        result = 'Fake' if prediction[0] == 1 else 'Real'
        
        return jsonify({'result': result, 'success': True})
    except Exception as e:
        return jsonify({'error': str(e), 'success': False}), 500

if __name__ == '__main__':
    app.run(debug=True)