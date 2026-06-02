import os
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import HuggingFaceEmbeddings

PDF_PATH = "cotton_manual.pdf"
DB_DIR = "./chroma_db"

def build_vector_store():

    if not os.path.exists(PDF_PATH):
        print(f"PDF File '{PDF_PATH}' not found. Please place your disease manual here.")
        return

    print("Parsing your PDF manual...")
    loader = PyPDFLoader(PDF_PATH)
    pages = loader.load()
    
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=600, chunk_overlap=100)
    chunks = text_splitter.split_documents(pages)
    
    print(f"Split PDF into {len(chunks)} text chunks.")
    embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
    
    print("Creating local database store inside 'chroma_db/'")
    Chroma.from_documents(documents=chunks, embedding=embeddings, persist_directory=DB_DIR)
    print("Success. Your local vector store is generated and ready.")

build_vector_store()