from utils.pdf_loader import load_pdfs
from utils.text_embedder import store_embeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter

if __name__ == "__main__":
    docs = load_pdfs("data")

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=2000,
        chunk_overlap=200
    )

    split_docs = splitter.split_documents(docs)

    print(f"🧩 Created {len(split_docs)} text chunks")

    store_embeddings(split_docs, "embeddings/text")
