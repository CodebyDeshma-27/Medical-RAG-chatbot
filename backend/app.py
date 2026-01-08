from flask import Flask, request, jsonify
from utils.rag_pipeline import get_rag_chain
from dotenv import load_dotenv
load_dotenv()

app = Flask(__name__)

# Initialize RAG chain (Chroma + Groq LLaMA)
qa_chain = get_rag_chain()

@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "message": "✅ Medical RAG Chatbot (Groq + LLaMA-3.1-8B) running!",
        "usage": "POST /ask → {'query': 'your question'}"
    })

@app.route("/ask", methods=["POST"])
def ask():
    try:
        data = request.get_json()
        query = data.get("query", "").strip()

        if not query:
            return jsonify({"error": "Query field is required"}), 400

        result = qa_chain(query)

        return jsonify({
            "answer": result["result"],
            "sources": list({
                doc.metadata.get("source", "Unknown")
                for doc in result["source_documents"]
            }),
            "ragContext": [
                doc.page_content
                for doc in result["source_documents"]
            ]
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=8000, debug=False)
