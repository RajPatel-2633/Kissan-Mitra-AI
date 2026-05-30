from fastapi import FastAPI,File,UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import numpy as np
from PIL import Image
import tensorflow as tf
import cv2
import io
from tensorflow.keras.applications.resnet50 import preprocess_input


app = FastAPI(title="Kisan Mitra AI - Model Server")

class PredictionResponse(BaseModel):
    disease: str
    display_name: str
    confidence: float
    is_healthy: bool

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

model = tf.keras.models.load_model("Kissan_AI_Model.keras")

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
    
    # PIL → numpy (same as Gradio's numpy input)
    img = Image.open(io.BytesIO(contents)).convert("RGB")
    img = np.array(img)                          # HWC, uint8
    
    # Resize (same as your Gradio code)
    img = cv2.resize(img, (224, 224))
    
    # Expand dims (same as your Gradio code)
    img = np.expand_dims(img, axis=0)
    
    # ResNet50 preprocessing (same as your Gradio code)
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
