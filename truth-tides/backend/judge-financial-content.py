import cohere
import os
from flask import Flask, request, jsonify
from dotenv import load_dotenv

app = Flask(__name__)

load_dotenv()
COHERE_API_KEY = os.getenv("COHERE_API_KEY")

co = cohere.Client(COHERE_API_KEY)

@app.route('/fact-check', methods=['POST'])
def fact_check():
    data = request.json
    text = data.get("text", "")
    
    if not text:
        return jsonify({"error": "No text provided"}), 400
    
    try:
        response = co.chat(
            message=f"""
            Fact Check this claim  "{text}". Output the answer in json format with True/False/Misleading/Unknown\n
            Reason: {{reason}}\n
            Confidence : {{confidence}}
            Sources: {{sources}}\n. Make sure sources reference web pages that clarify the claim.

            {{ "FactCheckResult": {{
            "Verdict": {{True/False/Misleading/Unknown}},
            "Reason": {{reasoning}},
            "Sources": {{ "Source1": {{sourcelink}}, ...}},
            "Additional Notes": {{notes}},
            "Confidence Percentage:" {{confidencePercentage}}
            }} }}
            """,
            connectors=[{"id": "web-search"}]
        )
        
        response_json = response.text
        
        return jsonify(response_json)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
