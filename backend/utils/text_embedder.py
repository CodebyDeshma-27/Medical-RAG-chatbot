from langchain_community.vectorstores import Chroma
from langchain_huggingface import HuggingFaceEmbeddings

BATCH_SIZE = 1000

def store_embeddings(docs, persist_dir="embeddings/text"):
    print("⚙️ Creating text embeddings (batched)...")

    embeddings = HuggingFaceEmbeddings(
        model_name="sentence-transformers/all-MiniLM-L12-v2"
    )

    vectordb = Chroma(
        persist_directory=persist_dir,
        embedding_function=embeddings
    )

    total = len(docs)

    for i in range(0, total, BATCH_SIZE):
        batch = docs[i:i + BATCH_SIZE]
        vectordb.add_documents(batch)
        print(f"  ✅ Embedded {min(i + BATCH_SIZE, total)} / {total}")

    print(f"💾 Embeddings stored at: {persist_dir}")