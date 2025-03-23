import requests
import json

API_URL = "http://127.0.0.1:5000/determine-financial"

test_data = {
    "texts": [
        "Apple's stock price surged 5% after the latest earnings report exceeded expectations.",
        "The NBA playoffs are starting next week with exciting matchups.",
        "Federal Reserve interest rate hikes could impact inflation and economic growth.",
        "New research suggests that drinking coffee has health benefits.",
        "Bitcoin and Ethereum saw significant price swings in the last 24 hours."
    ]
}

response = requests.post(API_URL, json=test_data, headers={"Content-Type": "application/json"})

if response.status_code == 200:
    print(json.dumps(response.json(), indent=4))
else:
    print(f"Error: {response.status_code}, Response: {response.text}")
