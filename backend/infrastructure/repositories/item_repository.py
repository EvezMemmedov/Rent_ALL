from typing import List
from domain.models import Item

# sadə in-memory storage
items_db: List[Item] = []

def get_all_items() -> List[Item]:
    return items_db

def add_item(item: Item) -> Item:
    items_db.append(item)
    return item
