import fitz
from langchain.schema import Document
import os

def load_pdfs(data_dir="data"):
    docs = []
    for filename in os.listdir(data_dir):
        if filename.endswith(".pdf"):
            path = os.path.join(data_dir, filename)
            with fitz.open(path) as pdf:
                text = ""
                for page in pdf:
                    text += page.get_text("text")
                docs.append(Document(page_content=text, metadata={"source": filename}))
    print(f"✅ Loaded {len(docs)} documents from {data_dir}")
    return docs
