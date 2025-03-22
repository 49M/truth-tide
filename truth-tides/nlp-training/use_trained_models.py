import os
import cohere
import pandas as pd
import json
from dotenv import load_dotenv

load_dotenv()
COHERE_API_KEY = os.getenv("COHERE_API_KEY")

co = cohere.Client(COHERE_API_KEY)

TRAINED_BIAS_MODEL_ID = ""
TRAINED_SENTIMENT_MODEL_ID = ""
TRAINED_FRAUDULENT_TWEETS_MODEL_ID = ""

with open("bias_training_data.jsonl", "r") as f:
    bias_test_data = [json.loads(line) for line in f]

with open("sentiment_training_data.jsonl", "r") as f:
    sentiment_test_data = [json.loads(line) for line in f]

bias_test_inputs = [item["text"] for item in bias_test_data[:5]]
sentiment_test_inputs = [item["text"] for item in sentiment_test_data[:5]]

print("Testing Bias Detection Model...")
bias_response = co.classify(
    model=TRAINED_BIAS_MODEL_ID,
    inputs=bias_test_inputs
)

for res, claim in zip(bias_response.classifications, bias_test_inputs):
    print(f"Claim: {claim} -> Bias: {res.prediction}")

print("\nTesting Sentiment Model...")
sentiment_response = co.classify(
    model=TRAINED_SENTIMENT_MODEL_ID,
    inputs=sentiment_test_inputs
)

for res, text in zip(sentiment_response.classifications, sentiment_test_inputs):
    print(f"News Text: {text} -> Sentiment: {res.prediction}")

print("\n🎉 Models are trained and running successfully!")

with open("fraudulant_tweets.jsonl", "r") as f:
    tweets_test_data = [json.loads(line) for line in f]

tweets_test_inputs = [item["text"] for item in tweets_test_data[:5]]

print("\nTesting Fraudulent Tweets Model...")
tweets_response = co.classify(
    model=TRAINED_FRAUDULENT_TWEETS_MODEL_ID,
    inputs=tweets_test_inputs
)

for res, tweet in zip(tweets_response.classifications, tweets_test_inputs):
    print(f"Tweet: {tweet} -> Classification: {res.prediction}")

print("\n🎉 Fraudulent Tweets model tested successfully!")
