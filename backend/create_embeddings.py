from utils.pdf_loader import load_pdfs
from utils.text_embedder import store_embeddings

if __name__ == "__main__":
    docs = load_pdfs("data")
    store_embeddings(docs, "embeddings/text")
