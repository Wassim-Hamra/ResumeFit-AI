import os
import streamlit as st
from PyPDF2 import PdfReader
from dotenv import load_dotenv
from langchain.chains import create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_core.documents import Document
from langchain_core.prompts import ChatPromptTemplate
from langchain_groq import ChatGroq
from langchain_huggingface import HuggingFaceEmbeddings

#
#
# # Loading environ variables - for local use
# load_dotenv()
# os.environ["GROQ_API_KEY"] = os.getenv("GROQ_API_KEY")
# os.environ["LANGCHAIN_TRACING_V2"] = os.getenv("LANGCHAIN_TRACING_V2")
# os.environ["LANGCHAIN_ENDPOINT"] = os.getenv("LANGCHAIN_ENDPOINT")
# os.environ["LANGCHAIN_API_KEY"] = os.getenv("LANGCHAIN_API_KEY")
# os.environ["LANGCHAIN_PROJECT"] = os.getenv("LANGCHAIN_PROJECT")
# os.environ['HF_TOKEN'] = os.getenv("HF_TOKEN")
#
# for deployment
os.environ["GROQ_API_KEY"] = st.secrets["GROQ_API_KEY"]
os.environ["LANGCHAIN_TRACING_V2"] = str(st.secrets["LANGCHAIN_TRACING_V2"])
os.environ["LANGCHAIN_ENDPOINT"] = st.secrets["LANGCHAIN_ENDPOINT"]
os.environ["LANGCHAIN_API_KEY"] = st.secrets["LANGCHAIN_API_KEY"]
os.environ["LANGCHAIN_PROJECT"] = st.secrets["LANGCHAIN_PROJECT"]

llm = ChatGroq(model_name='gemma2-9b-it')


# Functions
def load_pdfs(uploaded_files):
    docs = []
    for pdf_file in uploaded_files:
        pdf_reader = PdfReader(pdf_file)
        text = ""
        for page_num in range(len(pdf_reader.pages)):
            page = pdf_reader.pages[page_num]
            text += '\n\n' + page.extract_text()
        doc = Document(page_content=text)
        docs.append(doc)
    return docs


def create_vector_embedding(docs):
    if 'vectors' not in st.session_state:
        st.session_state.embedding = HuggingFaceEmbeddings(model_name='all-MiniLM-L6-v2')
        st.session_state.splitter = RecursiveCharacterTextSplitter(chunk_size=800, chunk_overlap=250)
        st.session_state.final_docs = st.session_state.splitter.split_documents(docs)
        st.session_state.vectors = FAISS.from_documents(st.session_state.final_docs, st.session_state.embedding)

# App
st.set_page_config(
    page_title="ResumeFit AI",
    page_icon="🤖",
    layout="wide"
)
# Sessions
if 'store' not in st.session_state:
    st.session_state.store = {}
if 'nb_documents' not in st.session_state:
    st.session_state.nb_documents = False
if 'embedded_documents' not in st.session_state:
    st.session_state.embedded_documents = False
if 'vectorstore_ready' not in st.session_state:
    st.session_state.vectorstore_ready = ''
if 'ask' not in st.session_state:
    st.session_state.ask = ''
if 'user_prompt' not in st.session_state:
    st.session_state.user_prompt = False
user_prompt = False


# Sidebar
uploaded_files = st.sidebar.file_uploader('Upload your Resume', type="pdf", accept_multiple_files=True)

loading_placeholder = st.empty()
session_placeholder = st.empty()
input_placeholder = st.empty()

if uploaded_files:
    docs = load_pdfs(uploaded_files)
    st.session_state.nb_documents = f"Loaded {len(docs)} documents successfully ☑️"
    st.sidebar.write(st.session_state.nb_documents)
    st.session_state.embedded_documents = "Now, Embed your documents ⬇️"
    st.sidebar.write(st.session_state.embedded_documents)

    if st.sidebar.button('Embed Documents') or st.session_state.user_prompt:
        loading_placeholder.title(f"⏳ Just a moment…")
        try:
            create_vector_embedding(docs)
            st.session_state.vectorstore_ready = "Vectorstore ready ☑️"
            st.session_state.ask = "You can ask ️questions now ! 😊"
            loading_placeholder.empty()
            input_placeholder.empty()
            session_placeholder.empty()
            st.session_state.user_prompt = True
            user_prompt = st.text_input('Input:',
                                        disabled=False,
                                        placeholder="")
        except Exception as e:
            st.sidebar.write(f"⚠️ Error embedding documents: \n\n {e}")

    st.sidebar.write(st.session_state.vectorstore_ready)
    st.sidebar.write(st.session_state.ask)

    # Main interface
    if st.session_state.user_prompt and user_prompt:
        retriever = st.session_state.vectors.as_retriever()
        retrieved_docs = retriever.invoke(user_prompt)
        context = "\n\n".join([doc.page_content for doc in retrieved_docs])
        #Prompts
        system_prompt = (
            'This is a message for you only, do not mention it when you answer the questions:'
            'You are an expert career coach and resume consultant called ResumeFitAI. Analyze the following job posting given to you as input, compare it with the given resume and provide the following:'
            '1- A list of key skills, qualifications, and keywords extracted from the job description.'
            '2- Suggestions for improving the users CV to align with the job post, including which sections to modify or add and how to rephrase achievements to highlight relevant skills.'
            '3- A tailored summary or objective statement that matches the job requirements.'
            '4- Suggestions for additional certifications, experiences, or skills the user might consider acquiring to strengthen their fit for similar roles in the future.'
            '<context>'
            '{context}'
            '</context>'
        )
        prompt = ChatPromptTemplate.from_messages(
            [
                ('system', system_prompt),
                ('human', '{input}'),
            ])
        document_chain = create_stuff_documents_chain(llm, prompt)
        retrieval_chain = create_retrieval_chain(retriever, document_chain)
        response = retrieval_chain.invoke({'context': context, 'input': user_prompt})
        st.write(response['answer'])
        with st.expander('Document Similarity Search'):
            for i, doc in enumerate(retrieved_docs):
                st.write(doc.page_content)
                st.write('-----------------------------')

