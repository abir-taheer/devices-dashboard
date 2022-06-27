import EventEmitter from "events";

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
const RawListItemCache: RawListItemCacheValue = {};

const maxAge = 1000 * 60 * 5;

// This is a proxied object that allows us to handle the expirations when fetching cached objects
class ListItemCache {
  public static set<List extends ListName>(list: List, items: ListDataMap[List][]) {
    const version = RawListItemCache[list]?.version + 1 || 0;
    const expiration = new Date(Date.now() + maxAge);
    const populated = true;

    // @ts-ignore
    RawListItemCache[list] = {
      version,
      items,
      expiration,
      populated,
    } as RawItemListCacheEntry<List>;

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

export default ListItemCache;
