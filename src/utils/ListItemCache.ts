import EventEmitter from "events";
import { DATA_TRANSFORMATIONS, METADATA_TRANSFORMATIONS } from "../constants";

export const CacheChangeEmitter = new EventEmitter();

type RawItemListCacheEntry<List extends ListName> = {
  items: ListDataMap[List][];
  version: number;
  expiration: Date;
  populated: boolean;
};

type RawListItemCacheValue = {
  [List in ListName]?: RawItemListCacheEntry<List>;
};

export type ItemIdMapValue = {
  [List in ListName]?: {
    [id: number | string]: ListDataMap[List];
  };
};

const ItemIdMap: ItemIdMapValue = {};

const RawListItemCache: RawListItemCacheValue = {};

const maxAge = 1000 * 60 * 2; // 2 minutes

// This is a proxied object that allows us to handle the expirations when fetching cached objects
class ListItemCache {
  public static set<List extends ListName>(list: List, rawItems: ListDataMap[List][]) {
    const version = RawListItemCache[list]?.version + 1 || 0;
    const expiration = new Date(Date.now() + maxAge);
    const populated = true;

    const items = rawItems.map((item) => {
      const newItem = { ...item };

      METADATA_TRANSFORMATIONS.map((transformation) => {
        if (item[transformation.field]) {
          newItem[transformation.field as string] = transformation.convert(
            item[transformation.field]
          );
        }
      });

      DATA_TRANSFORMATIONS[list].map((transformation) => {
        if (item[transformation.field]) {
          newItem[transformation.field as string] = transformation.convert(
            item[transformation.field]
          );
        }
      });

      return newItem;
    });

    // @ts-ignore
    RawListItemCache[list] = {
      version,
      items,
      expiration,
      populated,
    } as RawItemListCacheEntry<List>;

    // Update the id map too
    ItemIdMap[list] = items.reduce((map, item) => {
      map[item.ID] = item;
      return map;
    }, {});

    CacheChangeEmitter.emit("change", list);
  }

  public static get<List extends ListName>(list: List): RawItemListCacheEntry<List> {
    const cache = RawListItemCache[list];

    if (!cache) {
      return {
        version: -1,
        items: [],
        expiration: new Date(),
        populated: false,
      };
    }

    return cache;
  }
}

export function getCachedListItemById<List extends ListName>(
  list: List,
  id: number | string
): ListDataMap[List] | null {
  const cache = ItemIdMap[list];

  if (!cache) {
    return null;
  }

  return cache[id] as ListDataMap[List];
}

export default ListItemCache;
