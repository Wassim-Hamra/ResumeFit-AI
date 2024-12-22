# **🚀 ResumeFit AI: End to End RAG Application**

![file](Extension/assets/background.png.png)


## Notre solution est une extension Chrome qui facilite et optimise le processus de candidature en ligne. Grâce à l’extraction automatique des données des annonces et l’utilisation de techniques avancées comme la Recherche Augmentée (RAG) et les modèles de langage de grande taille (LLM), notre extension génère des recommandations personnalisées pour améliorer le CV.
  *  ***Demo link: [resumefit-ai.streamlit.app](https://resumefit-ai.streamlit.app/)***
  * **⚠️ Wake the Streamlit Application if it's sleeping**
## ***Extension Screenshots:***

![Architecture](Extension/assets/banner.png)
##
![Architecture](Extension/assets/upload.png)
![Architecture](Extension/assets/resume-uploaded.png)


## ***Architecture:***

![Architecture](Extension/assets/architecture.jpeg)
* Extension : Une extension de navigateur analyse les CV (avec Pdf.js) et intercepte les offres d'emploi via un service worker. Ces données sont envoyées à une API.
* API (FastAPI + Ngrok) : Reçoit les données de l'extension (CV et offres d'emploi) et les envoie aux autres modules pour traitement.
* Splitter et Embeddings : Le texte des CV et des offres est découpé, puis transformé en données numériques (embeddings) grâce à un modèle Hugging Face.
* Vector Store (FAISS) : Stocke ces données pour rechercher les similarités entre CV et offres d'emploi.
* Retriever : Trouve les correspondances les plus pertinentes.
* LLM (Gemma 2) : Analyse les correspondances et génère des recommandations.
* Overlay : Affiche les recommandations directement dans l'extension.

## ***File Hierarchy:***

![file](Extension/assets/file-hierarchy.jpeg)

## ***API:***

### ***ngrok Tunnel:***

![file](Extension/assets/ngrok.png)

### ***Sending a POST requests with cv/job post info and getting respone from the api:***

![file](Extension/assets/request.png)
### Terminal
![file](Extension/assets/terminal.png)

### Team 
  * **khalil kassentini**
  * **zyneb mrad**
  * **mahdi bani**
  * **wassim hamra**
  * **yahya ben ahmed**
##

**Real-world solutions are ten times better than pointless complexity 😉**