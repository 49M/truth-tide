import sys
import cohere
import os
import json
import re
import requests
from dotenv import load_dotenv

load_dotenv()
COHERE_API_KEY = os.getenv("COHERE_API_KEY")
co = cohere.Client(COHERE_API_KEY)

def fact_check(text):

    try:
        chat_response = co.chat(
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
            connectors=[{"id": "web-search"}],
        )

        cleaned_string = chat_response.text.strip('`').replace('json', '').strip()
        data = json.loads(cleaned_string)
        return data

    except json.JSONDecodeError as e:
        return {"error": f"Failed to parse JSON: {str(e)}"}
    except Exception as e:
        return {"error": str(e)}

def classify_financial_content(text):
    try:
        chat_response = co.chat(
            message=f'''Analyze this text for financial relevance and be super stringent and make sure the text is explicitly about finance in one word:\n\n{text}\n\nConsider these indicators:\n- Financial instruments/markets\n- Economic indicators\n- Corporate earnings\n- Investments/asset management/crypto\n- Banking/insurance terms\n\nOutput JSON format:\n{{\n  "is_financial": boolean,\n}}''',
            connectors=[{"id": "web-search"}],
        )
        cleaned_string = chat_response.text.strip('`').replace('json', '').strip()
        data = json.loads(cleaned_string)
        is_financial = data["is_financial"]

        if (is_financial):
            judge_response = fact_check(text)
            return judge_response
        else:
            return "not financial"

    except json.JSONDecodeError as e:
        return {"error": f"Invalid JSON response from Cohere: {str(e)}"}
    except KeyError as e:
        return {"error": f"Missing key in Cohere response: {str(e)}"}
    except Exception as e:
        return {"error": str(e)}



if __name__ == "__main__":
    print("Enter query")
    input = input()
    print(classify_financial_content(input))