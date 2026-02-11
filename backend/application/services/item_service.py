from typing import List
from infrastructure.repositories.item_repository import get_all_items, add_item
from domain.models import Item

def get_items_service() -> List[Item]:
    return get_all_items()

def add_item_service(item: Item) -> Item:
    return add_item(item)
