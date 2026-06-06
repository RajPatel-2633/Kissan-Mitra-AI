import os

os.environ["OMP_NUM_THREADS"] = "1"
os.environ["MKL_NUM_THREADS"] = "1"
os.environ["OPENBLAS_NUM_THREADS"] = "1"
os.environ["VECLIB_MAXIMUM_THREADS"] = "1"
os.environ["NUMEXPR_NUM_THREADS"] = "1"
os.environ["TF_NUM_INTEROP_THREADS"] = "1"
os.environ["TF_NUM_INTRAOP_THREADS"] = "1"
os.environ["TF_ENABLE_ONEDNN_OPTS"] = "0"
os.environ["TOKENIZERS_PARALLELISM"] = "false"
os.environ["KERAS_BACKEND"] = "tensorflow"

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import numpy as np
from PIL import Image
import tensorflow as tf
import keras
import cv2
import io
from tensorflow.keras.applications.resnet50 import  preprocess_input
from tensorflow.keras.applications import ResNet50
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D, Dropout, Input
from tensorflow.keras.models import Model


import ragEngine


app = FastAPI(title="Kisan Mitra AI - Model Server")


class PredictionResponse(BaseModel):
    disease: str
    display_name: str
    confidence: float
    is_healthy: bool

class ChatRequest(BaseModel):
    user_query: str
    detected_disease: str
    language: str = "English"

class ChatResponse(BaseModel):
    reply: str

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

def load_kissan_mitra_model(weights_path="Kissan_AI_Model.keras"):
    print("Initializing structural alignment framework...")
    

    inputs = Input(shape=(224, 224, 3))
    
    # 2. Add 5 simple placeholder layers to perfectly match the training file sequence order
    x = keras.layers.Activation('linear', name='patch_flip')(inputs)
    x = keras.layers.Activation('linear', name='patch_rot')(x)
    x = keras.layers.Activation('linear', name='patch_zoom')(x)
    x = keras.layers.Activation('linear', name='patch_trans')(x)
    x = keras.layers.Activation('linear', name='patch_contrast')(x)
    
   
    resnet_base = ResNet50(weights=None, include_top=False)(x)
    

    x = GlobalAveragePooling2D()(resnet_base)
    x = Dropout(0.5)(x)
    x = Dense(128, activation='relu')(x)
    predictions = Dense(4, activation='softmax')(x)
    

    inference_model = Model(inputs=inputs, outputs=predictions)
    
    print("Injecting learned matrix parameters sequentially into framework...")
    inference_model.load_weights(weights_path, skip_mismatch=True)
    
    return inference_model

print("Loading Kissan AI Model into memory dynamically")
model = load_kissan_mitra_model()
print("Model loaded successfully!")


CLASS_NAMES = [
    "bacterial_blight",
    "curl_virus",
    "fussarium_wilt",  
    "healthy"
]

DISPLAY_NAMES = {
    "bacterial_blight": "Bacterial Blight",
    "curl_virus": "Curl Virus",
    "fussarium_wilt": "Fusarium Wilt",
    "healthy": "Healthy"
}

@app.get("/")
def root():
    return {"status": "Kisan Mitra AI model server is running"}

@app.post("/predict", response_model=PredictionResponse)
async def predict(image: UploadFile = File(...)):
    contents = await image.read()
    
    # PIL → numpy 
    img = Image.open(io.BytesIO(contents)).convert("RGB")
    img = np.array(img)                          
    
    # Resize 
    img = cv2.resize(img, (224, 224))
    
    # Expand dimensions
    img = np.expand_dims(img, axis=0)
    
    # ResNet50 preprocessing 
    img = preprocess_input(img)

    

    predictions = model.predict(img)[0]
    class_index = int(np.argmax(predictions))
    confidence = float(np.max(predictions)) * 100
    disease = CLASS_NAMES[class_index]

    return PredictionResponse(
        disease=disease,
        display_name=DISPLAY_NAMES[disease],
        confidence=round(confidence, 2),
        is_healthy=disease == "healthy"
    )


@app.post("/chat/remedy", response_model=ChatResponse)
async def chat_remedy(payload: ChatRequest):
    try:


        # Pull corresponding display name string for localized prompting
        display_name = DISPLAY_NAMES.get(payload.detected_disease, payload.detected_disease)
        
        # Query your custom rag_engine layer
        ai_reply = ragEngine.generate_remedy(
            user_query=payload.user_query,
            detected_disease=payload.detected_disease,
            display_name=display_name,
            language=payload.language
        )
        return ChatResponse(reply=ai_reply)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"RAG thread execution failure: {str(e)}")
