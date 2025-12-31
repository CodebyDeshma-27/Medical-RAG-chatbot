from langchain_community.vectorstores import Chroma
from langchain.embeddings import HuggingFaceEmbeddings
from langchain.llms import HuggingFacePipeline
from langchain.chains import RetrievalQA
from transformers import AutoTokenizer, AutoModelForCausalLM, pipeline
import torch
import os

OFFLOAD_DIR = "./offload"
os.makedirs(OFFLOAD_DIR, exist_ok=True)

def get_rag_chain(persist_dir="embeddings/text"):
    print("🔍 Loading BioMistral-7B model and Chroma...")

    model_id = "BioMistral/BioMistral-7B"
    tokenizer = AutoTokenizer.from_pretrained(model_id)
    model = AutoModelForCausalLM.from_pretrained(
        model_id,
        device_map="auto",
        torch_dtype=torch.float16,
        offload_folder=OFFLOAD_DIR,
        low_cpu_mem_usage=True
    )

    pipe = pipeline(
        "text-generation",
        model=model,
        tokenizer=tokenizer,
        max_new_tokens=512,
        temperature=0.2,
        top_p=0.9
    )

    llm = HuggingFacePipeline(pipeline=pipe)

    embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
    vectordb = Chroma(persist_directory=persist_dir, embedding_function=embeddings)
    retriever = vectordb.as_retriever(search_kwargs={"k": 3})

    qa_chain = RetrievalQA.from_chain_type(
        llm=llm,
        retriever=retriever,
        chain_type="stuff",
        return_source_documents=True
    )

    print("✅ BioMistral-7B RAG pipeline ready.")
    return qa_chain
