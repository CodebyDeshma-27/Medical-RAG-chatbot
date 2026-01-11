from flask import Flask, request, jsonify
from flask_cors import CORS
from utils.rag_pipeline import get_rag_components
from dotenv import load_dotenv

load_dotenv()
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

qa_chain, llm = get_rag_components()


# -----------------------------
# Helper: summarize one chunk
# -----------------------------
def summarize_excerpt(query, text):
    prompt = f"""
You are a medical research assistant.

Summarize the following medical text in 2–3 concise sentences,
focusing ONLY on information relevant to this question.

Question:
{query}

Medical Text:
{text}

Summary:
"""
    response = llm.invoke(prompt)
    return response.content.strip()

@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "message": "✅ Medical RAG Chatbot running (Groq + LLaMA-3.1-8B)",
        "usage": "POST /ask → { 'query': 'medical question' }"
    })

@app.route("/ask", methods=["POST"])
def ask():
    try:
        query = request.json.get("query", "").strip()
        if not query:
            return jsonify({"error": "Query is required"}), 400

        result = qa_chain.invoke({"query": query})
        source_docs = result.get("source_documents", [])

        # No relevant retrieval → honest response
        if not source_docs:
            return jsonify({
                "message": "I don't have sufficient information in my medical knowledge base to answer this question.",
                "citations": [],
                "ragContext": [],
                "confidence": "low"
            })

        citations = []
        rag_context = []  # ✅ Will be strings only

        for doc in source_docs:
            summary = summarize_excerpt(query, doc.page_content)
            
            citations.append({
                "book": doc.metadata.get("book"),
                "chapter": doc.metadata.get("chapter"),
                "page": doc.metadata.get("page")
            })
            
            # ✅ Convert to string format expected by frontend
            rag_context.append(f"{doc.metadata.get('book', 'Unknown')} - Ch {doc.metadata.get('chapter', 'N/A')} (p{doc.metadata.get('page', 'N/A')}): {summary}")

        return jsonify({
            "message": result["result"],
            "citations": citations,
            "ragContext": rag_context,  # ✅ Now array of strings
            "confidence": "high"
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=8000, debug=False)
