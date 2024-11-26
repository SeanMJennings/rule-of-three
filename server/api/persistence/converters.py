from typing import TypeVar
from azure.core.paging import ItemPaged

T = TypeVar("T")


def convert_to_domain(_type: T, paged_items: ItemPaged):
    list_items = list(iter(paged_items))
    if len(list_items) > 0:
        return _type.from_dict(list_items[0])
    return None


def convert_to_domain_list(_type: T, items: ItemPaged):
    list_items = list(iter(items))
    if len(list_items) > 0:
        return [_type.from_dict(item) for item in list_items]
    return []
