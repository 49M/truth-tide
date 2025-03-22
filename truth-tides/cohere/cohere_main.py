#!/usr/bin/env python3
import os, json
from dotenv import load_dotenv
import cohere
from tavily import TavilyClient

load_dotenv()
co = cohere.ClientV2(api_key=os.environ["VITE_COHERE_API_KEY"])
tavily = TavilyClient(api_key=os.environ["VITE_TAVILY_API_KEY"])

def ask(query: str):
    # Step 1: fetch top 5 snippets from Tavily
    tavily_results = tavily.search(query, max_results=5)["results"]
    documents = [
        {"data": {"text": r["content"], "url": r["url"]}}
        for r in tavily_results
    ]

    # Step 2: single-chat RAG call
    response = co.chat(
        model="command-a-03-2025",
        messages=[{"role": "user", "content": query}],
        documents=documents
    )

    answer = response.message.content[0].text
    citations = response.message.citations or []
    return answer, citations

def main():
    print("Ask anything (type 'exit' to quit):")
    while True:
        q = input("> ")
        if q.lower() in ("exit", "quit"):
            break
        ans, cites = ask(q)
        print("\n📝 Answer:", ans)
        if cites:
            print("\n🔗 Citations:")
            for c in cites:
                print(f" • “{c.text}” — {c.sources[0].document.get('url')}")
        print("-" * 40)

if __name__ == "__main__":
    main()