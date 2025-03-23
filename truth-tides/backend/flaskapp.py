import cohere
import os
import json
import re
from flask_cors import CORS
import requests
from flask import Flask, request, jsonify
from dotenv import load_dotenv

app = Flask(__name__)

CORS(app)

load_dotenv()
COHERE_API_KEY = os.getenv("COHERE_API_KEY")
co = cohere.ClientV2(COHERE_API_KEY)

system_message_template = "Only generate the answer to what is asked of you, and return nothing else. Do not generate Markdown backticks."

def fact_check(text):
    try:
        chat_response = co.chat(
            model="command-r",
            messages=[
                {
                    "role": "user",
                    "content": f"""
                Fact Check this claim: "{text}". Output the answer in JSON format with True/False/Misleading/Unknown. Do not use markdown backticks. Make sure things are nice, concise and direct.
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

                enforce that it validates against this schema:
                
                SCHEMA = {{
                    "$schema": "http://json-schema.org/draft-07/schema#",
                    "type": "object",
                    "properties": {{
                        "FactCheckResult": {{
                            "type": "object",
                            "properties": {{
                                "Verdict": {{
                                    "type": "string",
                                    "enum": ["True", "False", "Misleading", "Unknown"]
                                }},
                                "Reason": {{
                                    "type": "string"
                                }},
                                "Sources": {{
                                    "type": "object",
                                    "properties": {{
                                        "Source1": {{ "type": "string", "format": "uri" }},
                                        "Source2": {{ "type": "string", "format": "uri" }}
                                    }},
                                    "required": ["Source1", "Source2"]
                                }},
                                "Additional Notes": {{
                                    "type": "string"
                                }},
                                "Confidence Percentage": {{
                                    "type": "number",
                                    "minimum": 0,
                                    "maximum": 100
                                }}
                            }},
                            "required": ["Verdict", "Reason", "Sources", "Confidence Percentage"]
                        }}
                    }},
                    "required": ["FactCheckResult"]
                }}
                """,
                }
            ],
        )

        return chat_response.message.content[0].text

    except json.JSONDecodeError as e:
        return {"error": f"Failed to parse JSON: {str(e)}"}
    except Exception as e:
        return {"error": str(e)}


@app.route('/determine-financial', methods=['POST'])
def classify_financial_content():
    data = request.get_json()
    text = data.get("text")

    try:
        chat_response = co.chat(
            model="command-r",
            messages=[
                {
                    "role": "user",
                    "content": f'''Analyze this text for financial relevance and be super stringent and make sure the text is explicitly about finance in one word:\n\n{text}\n\nConsider these indicators:\n- Financial instruments/markets\n- Economic indicators\n- Corporate earnings\n- Investments/asset management/crypto\n- Banking/insurance terms\n\nOutput JSON format:\n{{\n  "is_financial": boolean,\n}}''',
                }
            ],
        )
        cleaned_string = chat_response.message.content[0].text.strip('`').replace('json', '').strip()
        data = json.loads(cleaned_string)
        is_financial = data["is_financial"]

        if (is_financial):
            judge_response = fact_check(text)
            return judge_response
        else:
            return {"not financial": 1}

    except json.JSONDecodeError as e:
        return {"error": f"Invalid JSON response from Cohere: {str(e)}"}
    except KeyError as e:
        return {"error": f"Missing key in Cohere response: {str(e)}"}
    except Exception as e:
        return {"error": str(e)}




if __name__ == '__main__':
    app.run(debug=True, port=5000)
