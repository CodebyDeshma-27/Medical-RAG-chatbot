import fitz
import os
import re
from langchain.schema import Document

MIN_TEXT_LENGTH = 400
MAX_PAGES_PER_PDF = 300

CHAPTER_PATTERN = re.compile(
    r"(chapter\s+\d+|chapter\s+[ivxlcdm]+)",
    re.IGNORECASE
)

def load_pdfs(data_dir="data"):
    docs = []

    for filename in os.listdir(data_dir):
        if not filename.lower().endswith(".pdf"):
            continue

        path = os.path.join(data_dir, filename)
        print(f"📘 Processing {filename}")

        current_chapter = "Unknown"

        with fitz.open(path) as pdf:
            for page_num, page in enumerate(pdf, start=1):

                if page_num > MAX_PAGES_PER_PDF:
                    break

                text = page.get_text("text").strip()
                if len(text) < MIN_TEXT_LENGTH:
                    continue

                lower_text = text.lower()
                if any(k in lower_text for k in [
                    "references", "bibliography", "index",
                    "acknowledgement", "appendix"
                ]):
                    continue

                match = CHAPTER_PATTERN.search(text)
                if match:
                    current_chapter = match.group(0).title()

                docs.append(
                    Document(
                        page_content=text,
                        metadata={
                            "book": filename,
                            "page": page_num,
                            "chapter": current_chapter
                        }
                    )
                )

    print(f"✅ Loaded {len(docs)} high-signal PDF pages")
    return docs
