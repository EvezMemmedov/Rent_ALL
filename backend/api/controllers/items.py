from fastapi import APIRouter
from application.services.item_service import get_items_service, add_item_service
from domain.models import Item

router = APIRouter()

@router.get("/items")
def get_items():
    return get_items_service()

@router.post("/items")
def create_item(item: Item):
    return add_item_service(item)

