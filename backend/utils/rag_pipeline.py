import os
from langchain_community.vectorstores import Chroma
from sentence_transformers import SentenceTransformer
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

# Embeddings wrapper for Chroma using sentence-transformers
class SentenceTransformerEmbeddings:
    def __init__(self, model_name="sentence-transformers/all-MiniLM-L12-v2"):
        self.model = SentenceTransformer(model_name)
    
    def embed_documents(self, texts):
        return [embedding.tolist() for embedding in self.model.encode(texts)]
    
    def embed_query(self, text):
        return self.model.encode(text).tolist()
    
    def __call__(self, texts):
        """Make it callable for Chroma compatibility"""
        return self.embed_documents(texts)

# Simple wrapper to use Groq with LangChain
class GroqLLM:
    def __init__(self, api_key, model="llama-3.1-8b-instant", temperature=0.2, max_tokens=512):
        self.client = Groq(api_key=api_key)
        self.model = model
        self.temperature = temperature
        self.max_tokens = max_tokens

    def invoke(self, prompt):
        """LangChain-compatible invoke method"""
        response = self.client.messages.create(
            model=self.model,
            messages=[{"role": "user", "content": prompt}],
            temperature=self.temperature,
            max_tokens=self.max_tokens,
        )
        class ContentWrapper:
            def __init__(self, text):
                self.content = text
        return ContentWrapper(response.choices[0].message.content)

def get_rag_components(persist_dir="embeddings/text"):
    print("⚡ Loading Chroma + Groq LLaMA-3.1-8B")

    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        raise RuntimeError(
            "Missing GROQ_API_KEY environment variable. "
            "Create backend/.env from backend/.env.example or set GROQ_API_KEY."
        )

    llm = GroqLLM(
        api_key=api_key,
        model="llama-3.1-8b-instant",
        temperature=0.2,
        max_tokens=512
    )

    embeddings = SentenceTransformerEmbeddings(
        model_name="sentence-transformers/all-MiniLM-L12-v2"
    )

    vectordb = Chroma(
        persist_directory=persist_dir,
        embedding_function=embeddings
    )

    retriever = vectordb.as_retriever(
        search_type="mmr",
        search_kwargs={"k": 4, "fetch_k": 12}
    )

    # Simple QA chain using the retriever and LLM
    class SimpleQAChain:
        def __init__(self, llm, retriever):
            self.llm = llm
            self.retriever = retriever

        def invoke(self, inputs):
            query = inputs.get("query", "")
            docs = self.retriever.get_relevant_documents(query)
            
            context = "\n".join([doc.page_content for doc in docs])
            prompt = f"""Answer the question based on the context provided.

Context:
{context}

Question: {query}

Answer:"""
            
            result = self.llm.invoke(prompt)
            return {
                "result": result.content,
                "source_documents": docs
            }

    qa_chain = SimpleQAChain(llm, retriever)

    print("✅ RAG pipeline ready")
    return qa_chain, llm