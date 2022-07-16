import ListItemIndexedCache from "./ListItemIndexedCache";

export function getCachedListItemById<List extends ListName>(
  list: List,
  id: number | string
): ListDataMap[List] | null {
  const { items } = ListItemIndexedCache.getIndex(list, "Id", "unique");

  return items[id] || null;
}
