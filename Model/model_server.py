from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import numpy as np
from PIL import Image
import tensorflow as tf
import cv2
import io
from tensorflow.keras.applications.resnet50 import preprocess_input

# import ragEngine


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

model = None

def get_model():
    global model
    if model is None:
        print("Loading Kissan AI Model into memory dynamically")
        model = tf.keras.models.load_model("Kissan_AI_Model.keras")
        print("Model loaded successfully!")
    return model

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

    #Retrieve the model weights inside the route
    current_model = get_model()

    predictions = current_model.predict(img)[0]
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

        # Lazy import ragEngine only when a chat request arrives
        import ragEngine
        
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
