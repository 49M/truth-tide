import cohere
import os
import json
import re
import requests
from flask import Flask, request, jsonify
from dotenv import load_dotenv

app = Flask(__name__)

load_dotenv()
COHERE_API_KEY = os.getenv("COHERE_API_KEY")
co = cohere.Client(COHERE_API_KEY)

@app.route('/determine-financial', methods=['POST'])
def classify_financial_content():
    data = request.json
    texts = data.get("texts", [])

    if not texts:
        return jsonify({"error": "No texts provided"}), 400

    results = {}
    for text in texts:
        try:
            chat_response = co.chat(
                message=f'''Analyze this text for financial relevance and be super stringent and make sure the text is explicitly about finance in one word:\n\n{text}\n\nConsider these indicators:\n- Financial instruments/markets\n- Economic indicators\n- Corporate earnings\n- Investments/asset management/crypto\n- Banking/insurance terms\n\nOutput JSON format:\n{{\n  "is_financial": boolean,\n}}''',
                connectors=[{"id": "web-search"}]
            )

            response_json = re.sub(r"```json|```", "", chat_response.text.strip())
            analysis = json.loads(response_json)
            
            is_financial = analysis.get("is_financial", False)

            judged_content = None

            if is_financial:
                judge_response = requests.post(
                    "http://127.0.0.1:5000/fact-check",
                    json={"text": text},
                    headers={"Content-Type": "application/json"}
                )
                if judge_response.status_code == 200:
                    try:
                        judged_content = judge_response.json()
                    except json.JSONDecodeError:
                        pass
            if judged_content:
                results[text] = {
                    "judged_content": judged_content
                }

        except json.JSONDecodeError as e:
            results[text] = {"error": f"Invalid JSON response from Cohere: {str(e)}"}
        except KeyError as e:
            results[text] = {"error": f"Missing key in Cohere response: {str(e)}"}
        except Exception as e:
            results[text] = {"error": str(e)}

    return jsonify(results)

@app.route('/fact-check', methods=['POST'])
def fact_check():
    data = request.json
    text = data.get("text", "")
    
    if not text:
        return jsonify({"error": "No text provided"}), 400
    
    try:
        response = co.chat(
            message=f"""
            Fact Check this claim: "{text}". Output the answer in JSON format with True/False/Misleading/Unknown. Make sure things are nice, concise and direct.
            Provide structured output in the following format in the order I gave it:

            {{
              "FactCheckResult": {{
                "Verdict": "True/False/Misleading/Unknown",
                "Reason": "{{reasoning}}",
                "Sources": {{
                  "Source1": "{{sourcelink}}",
                  "Source2": "{{sourcelink}}"
                }},
                "Additional Notes": "{{notes}}",
                "Confidence Percentage": "{{confidencePercentage}}"
              }}
            }}
            """,
            connectors=[{"id": "web-search"}]
        )

        response_json = re.sub(r"```json|```", "", response.text.strip())
        fact_check_result = json.loads(response_json)['FactCheckResult']

        return jsonify(fact_check_result)

    except json.JSONDecodeError as e:
        return jsonify({"error": f"Failed to parse JSON: {str(e)}"}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
