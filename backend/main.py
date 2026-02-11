from fastapi import FastAPI
from api.controllers import items  # items.py faylından import

app = FastAPI()

app.include_router(items.router)  # /items endpoint-i əlavə olunur

@app.get("/")
def read_root():
    return {"message": "Hello, RentALL backend!"}

