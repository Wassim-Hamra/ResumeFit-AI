from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.responses import JSONResponse
from langchain.chains import create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.documents import Document
from langchain_groq import ChatGroq
from langchain_huggingface import HuggingFaceEmbeddings

# Initialize FastAPI app
api_app = FastAPI()

# Load environment variables
from dotenv import load_dotenv
import os

if os.getenv("RAILWAY_ENVIRONMENT") is None:  # Assuming Railway sets this in their environment
    load_dotenv()
os.environ["GROQ_API_KEY"] = os.getenv("GROQ_API_KEY")
os.environ["HF_TOKEN"] = os.getenv("HF_TOKEN")

# Initialize model
llm = ChatGroq(model_name="gemma2-9b-it")


# Pydantic model for input data
class JobData(BaseModel):
    job_post: str
    cv: str

# Function to process resumes into vector embeddings
def create_vector_embedding(cv_text):
    # Split CV into chunks
    splitter = RecursiveCharacterTextSplitter(chunk_size=800, chunk_overlap=250)
    final_docs = splitter.split_documents([Document(page_content=cv_text)])

    # Create vector store
    embedding = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
    vectors = FAISS.from_documents(final_docs, embedding)
    return vectors


# API Endpoint
@api_app.get("/analyze")
async def analyze_job(data: JobData):
    # Extract job post and CV
    job_post = data.job_post
    cv_text = data.cv
    # Embed CV into vector space
    vectors = create_vector_embedding(cv_text)

    # Create retriever
    retriever = vectors.as_retriever()
    retrieved_docs = retriever.invoke(job_post)
    context = "\n\n".join([doc.page_content for doc in retrieved_docs])

    # System prompt
    system_prompt = (
        'You are an expert career coach and resume consultant called ResumeFitAI. '
        'Analyze the following job posting given to you as input, compare it with the given resume, and provide the following:'
        '1- A list of key skills, qualifications, and keywords extracted from the job description.'
        '2- Suggestions for improving the user\'s CV to align with the job post, including which sections to modify or add and how to rephrase achievements to highlight relevant skills.'
        '3- A tailored summary or objective statement that matches the job requirements.'
        '4- Suggestions for additional certifications, experiences, or skills the user might consider acquiring to strengthen their fit for similar roles in the future.'
        '<context>'
        '{context}'
        '</context>'
    )

    # Create prompt and chains
    prompt = ChatPromptTemplate.from_messages(
        [
            ("system", system_prompt),
            ("human", job_post),
        ]
    )
    document_chain = create_stuff_documents_chain(llm, prompt)
    retrieval_chain = create_retrieval_chain(retriever, document_chain)

    # # Get response
    response = retrieval_chain.invoke({"context": context, "input": job_post})

    # Return response as JSON
    return JSONResponse(content={"answer": response['answer']})
