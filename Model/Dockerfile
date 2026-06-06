FROM python:3.11-slim

WORKDIR /code

# Set Python to run unbuffered so your print logs stream to Hugging Face instantly
ENV PYTHONUNBUFFERED=1
ENV TF_ENABLE_ONEDNN_OPTS=0
ENV TOKENIZERS_PARALLELISM=false
ENV OMP_NUM_THREADS=1
ENV MKL_NUM_THREADS=1

COPY ./requirements.txt /code/requirements.txt
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

COPY . .


# Expose and bind to port 7860 as strictly required by Hugging Face Spaces
EXPOSE 7860

CMD ["sh", "-c", "python seedPdf.py && uvicorn model_server:app --host 0.0.0.0 --port 7860"]