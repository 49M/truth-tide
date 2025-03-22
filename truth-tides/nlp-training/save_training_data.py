import os
import json
import pandas as pd
import re
from dotenv import load_dotenv

load_dotenv()

def clean_text(text):
    if pd.isna(text):
        return ""
    text = re.sub(r"http\S+|www\S+|https\S+", "", str(text))
    text = str(text).lower().strip()
    return text

print("Loading Fin-Fact dataset...")
finfact_df = pd.read_json("hf://datasets/amanrangapur/Fin-Fact/finfact.json")
finfact_df = finfact_df[["claim", "label"]]
finfact_df["claim"] = finfact_df["claim"].apply(clean_text)

label_map = {"true": "factual", "false": "misleading", "neutral": "speculative"}
finfact_df["bias_label"] = finfact_df["label"].map(label_map)

with open("bias_training_data.jsonl", "w") as f:
    for _, row in finfact_df.iterrows():
        json.dump({
            "messages": [
                {"role": "User", "content": row["claim"]},
                {"role": "Label", "content": row["bias_label"]}
            ]
        }, f)
        f.write("\n")

finfact_df[["claim", "bias_label"]].to_csv("bias_training_data.csv", index=False)

print("✅ Saved bias training data as JSONL & CSV.")

print("Loading Financial News Sentiment dataset...")
twitter_df = pd.read_csv("hf://datasets/dilkasithari-IT/sentiment_analysis_financial_news_data/train.csv")
twitter_df = twitter_df[["combined_text", "sentiment_score"]]
twitter_df["combined_text"] = twitter_df["combined_text"].apply(clean_text)

sentiment_map = {1: "positive", 0: "neutral", -1: "negative"}
twitter_df["sentiment_label"] = twitter_df["sentiment_score"].map(sentiment_map)

with open("sentiment_training_data.jsonl", "w") as f:
    for _, row in twitter_df.iterrows():
        json.dump({
            "messages": [
                {"role": "User", "content": row["combined_text"]},
                {"role": "Label", "content": row["sentiment_label"]}
            ]
        }, f)
        f.write("\n")

twitter_df[["combined_text", "sentiment_label"]].to_csv("sentiment_training_data.csv", index=False)

print("✅ Saved sentiment training data as JSONL & CSV.")

print("Loading Fraudulent Tweets dataset...")
tweets_df = pd.read_csv("fraudulant_tweets.csv")
tweets_df["text"] = tweets_df["text"].apply(clean_text)
with open("fraudulant_tweets.jsonl", "w") as f:
    for i, (_, row) in enumerate(tweets_df.iterrows(), start=1):
        try:
            json.dump({
                "messages": [
                    {"role": "User", "content": row["text"]},
                    {"role": "Chatbot", "content": f"{row['label'].capitalize()}: {row['reason']}"}
                ]
            }, f)
            f.write("\n")
        except Exception as e:
            print(f"Error processing row {i}: Label='{str(row['label'])}' Reason='{str(row['reason'])}'")
            raise e

print("✅ Saved fraudulent tweets data as JSONL with explanations.")
