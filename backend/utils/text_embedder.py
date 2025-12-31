from langchain_community.vectorstores import Chroma
from langchain_huggingface import HuggingFaceEmbeddings

def store_embeddings(docs, persist_dir="embeddings/text"):
    print("⚙️ Creating text embeddings...")
    embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

    vectordb = Chroma.from_documents(
        documents=docs,
        embedding=embeddings,
        persist_directory=persist_dir
    )
    vectordb.persist()
    print(f"💾 Embeddings stored successfully in: {persist_dir}")
