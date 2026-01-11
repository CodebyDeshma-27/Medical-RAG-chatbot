import os
from langchain_community.vectorstores import Chroma
from langchain_huggingface import HuggingFaceEmbeddings
from langchain.chains import RetrievalQA
from langchain_groq import ChatGroq

def get_rag_components(persist_dir="embeddings/text"):
    print("⚡ Loading Chroma + Groq LLaMA-3.1-8B")

    llm = ChatGroq(
        groq_api_key=os.environ["GROQ_API_KEY"],
        model_name="llama-3.1-8b-instant",
        temperature=0.2,
        max_tokens=512
    )

    embeddings = HuggingFaceEmbeddings(
        model_name="sentence-transformers/all-MiniLM-L12-v2"
    )

    vectordb = Chroma(
        persist_directory=persist_dir,
        embedding_function=embeddings
    )

    retriever = vectordb.as_retriever(
        search_type="mmr",
        search_kwargs={
            "k": 4,
            "fetch_k": 12
        }
    )

    qa_chain = RetrievalQA.from_chain_type(
        llm=llm,
        retriever=retriever,
        chain_type="stuff",
        return_source_documents=True
    )

    print("✅ RAG pipeline ready")
    return qa_chain, llm