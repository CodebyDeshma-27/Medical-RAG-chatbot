from flask import Flask, request, jsonify
from utils.rag_pipline import get_rag_chain

app = Flask(__name__)

# Initialize RAG chain (Chroma + BioMistral LLM)
qa_chain = get_rag_chain()

@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "message": "✅ Medical RAG Chatbot (BioMistral) is running!",
        "usage": "POST /ask → {'query': 'your question'}"
    })

@app.route("/ask", methods=["POST"])
def ask():
    try:
        data = request.get_json()
        query = data.get("query", "").strip()

        if not query:
            return jsonify({"error": "Query field is required"}), 400

        # Run RAG
        result = qa_chain(query)

        answer = result["result"]

        # 🔑 Extract retrieved chunks
        source_docs = result.get("source_documents", [])

        rag_context = [
            doc.page_content for doc in source_docs
        ]

        sources = [
            doc.metadata.get("source", "Unknown")
            for doc in source_docs
        ]

        return jsonify({
            "answer": answer,
            "sources": list(set(sources)),
            "ragContext": rag_context
        })

    except Exception as e:
        print("❌ Error:", e)
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=8000, debug=False)
