import os
import threading

# Lazy loading flags
VECTOR_DB_ENABLED = False
_model = None
_model_lock = threading.Lock()

try:
    import faiss
    import numpy as np
    VECTOR_DB_ENABLED = True
except ImportError:
    print("Vector DB libraries not fully installed (faiss/numpy missing).")
    VECTOR_DB_ENABLED = False

# Embedding dimension for MiniLM is 384
dimension = 384
index = None
if VECTOR_DB_ENABLED:
    try:
        index = faiss.IndexFlatL2(dimension)
    except:
        VECTOR_DB_ENABLED = False

documents = [] # To store actual text metadata aligned with FAISS index

def get_model():
    global _model
    with _model_lock:
        if _model is None:
            from sentence_transformers import SentenceTransformer
            print("Loading SentenceTransformer model...")
            try:
                # Use a smaller/faster variant if possible, sticking to requested all-MiniLM-L6-v2
                _model = SentenceTransformer('all-MiniLM-L6-v2')
                print("Model loaded.")
            except Exception as e:
                print(f"Error loading model: {e}")
                _model = None
    return _model

def add_to_index(text: str, metadata: dict):
    if not VECTOR_DB_ENABLED or not text:
        return
    model = get_model()
    vector = model.encode([text])
    import numpy as np
    vec = np.array(vector).astype('float32')
    index.add(vec)
    documents.append({"text": text, "metadata": metadata})

def search_index(query: str, k: int = 3):
    if not VECTOR_DB_ENABLED or index is None or index.ntotal == 0:
        return []
    
    model = get_model()
    query_vector = model.encode([query])
    import numpy as np
    vec = np.array(query_vector).astype('float32')
    distances, indices = index.search(vec, k)
    
    results = []
    for i in indices[0]:
        if i != -1 and i < len(documents):
            results.append(documents[i])
    return results
