from langchain.vectorstores import Chroma
from langchain.embeddings import HuggingFaceEmbeddings       # ✅ fixed
from langchain_community.document_loaders import TextLoader    # ✅ fixed

BATCH_SIZE = 1000


def store_embeddings(docs, persist_dir="backend/embeddings/text"):
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


if __name__ == "__main__":
    print("📂 Loading documents...")

    loader = TextLoader("backend/sample.txt")
    docs = loader.load()

    print(f"📄 Loaded {len(docs)} document(s)")

    store_embeddings(docs)