import os
from pydantic import BaseModel, Field
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_groq import ChatGroq
from langchain_core.messages import SystemMessage, HumanMessage
from langchain_core.output_parsers import JsonOutputParser

DB_DIR = "./chroma_db"

class IntentClassifier(BaseModel):
    intent: str = Field(description=
                        "Must be exactly either 'disease treatment' or 'general farming'.")


embedding_model = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

router_llm = ChatGroq(model="llama3-8b-8192", temperature=0.0)
generation_llm = ChatGroq(model="llama3-8b-8192", temperature=0.3)

if os.path.exists(DB_DIR):
    vector_store = Chroma(persist_directory=DB_DIR, embedding_function=embedding_model)
else:
    vector_store = None
    print("Chroma DB folder not found. Please run seedPdf.py first")


def route_user_intent(user_query: str) -> str:
    """
    Classifies user query intent using a strict JSON parser scheme.
    """
    parser = JsonOutputParser(pydantic_object=IntentClassifier)
    
    system_prompt = SystemMessage(content=f"""
You are a strict agricultural query classifier backend. Your job is to classify what a cotton farmer is asking into one of two precise intents:

- 'disease treatment': The farmer is asking about treating a disease, curing a pest, natural remedies, organic sprays, or managing an infection/crop sickness.
- 'general farming': The farmer is asking about weather, crop pricing, sowing seasons, regular watering schedules, soil health, fertilizers, or general friendly chitchat.

Format Instructions:
{parser.get_format_instructions()}

Respond ONLY with a valid JSON block matching the schema. Do not include markdown blocks or conversational text wrappers outside the JSON.
""")

    messages = [system_prompt] + [HumanMessage(content=f"Farmer Query: {user_query}")]
    
    try:
        result = router_llm.invoke(messages)
        parsed_res = parser.parse(result.content)
        return parsed_res.get("intent", "general farming")
    except Exception as e:
        print(f"Falling back to general farming. Error: {e}")
        return "general farming"


def generate_remedy(user_query: str, detected_disease: str, display_name: str) -> str:
    """
    Routes query and returns final generated output from Groq.
    """
    user_intent = route_user_intent(user_query)
    print(f"User input classified as: {user_intent}")
    
    if user_intent == "disease treatment":
        if not vector_store:
            return "Kisan Mitra AI system error: The disease knowledge base is currently offline."
            
        search_query = f"Organic treatments and biological control methods for managing {display_name} in cotton crops."
        docs = vector_store.similarity_search(search_query, k=3)
        context = "\n\n".join([doc.page_content for doc in docs])
        
        system_prompt = SystemMessage(content=f"""
You are Kisan Mitra AI, an expert agricultural assistant specializing in natural, organic, and sustainable remedies for cotton farmers.
The farmer's cotton crop has been diagnosed with: **{display_name}**.

Use ONLY the following verified agricultural manual context to answer the user's question. Provide actionable, step-by-step methods that a local farmer can execute easily.
If the context does not contain organic remedies for this specific problem, say you don't know. Do not hallucinate or recommend chemical pesticides.

--- Context From Manual ---
{context}
""")
        
        messages = [system_prompt] + [HumanMessage(content=user_query)]
        response = generation_llm.invoke(messages)
        return response.content
        
    else:
        system_prompt = SystemMessage(content="""
You are Kisan Mitra AI, an empathetic agricultural assistant helping Indian cotton farmers with general cultivation guidance.
Answer the farmer's question thoroughly using safe, practical, organic, and expert agricultural advice tailored to Indian soil, timelines, and cotton care.
""")
        
        messages = [system_prompt] + [HumanMessage(content=user_query)]
        response = generation_llm.invoke(messages)
        return response.content