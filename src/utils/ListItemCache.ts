import { ListChangeEmitter } from "../hooks/useSubscribeToListChanges";

type CacheItem<List extends ListName> = {
  expires: Date;
  items: ListDataMap[List][];
};

type RawListItemCacheValue = {
  [List in ListName]?: CacheItem<List>;
};

const RawListItemCache: RawListItemCacheValue = {};

const maxAge = 1000 * 60 * 5;

export const CacheProxyHandler = {
  set<List extends ListName>(obj: RawListItemCacheValue, prop: List, value: ListDataMap[List][]) {
    const expires = new Date(Date.now() + maxAge);
    // Indicate success
    const newValue = {
      items: value,
      expires,
    };

    obj[prop] = newValue as RawListItemCacheValue[List];

    ListChangeEmitter.emit("change", prop);
    return true;
  },

  get<List extends ListName>(obj: RawListItemCacheValue, prop: List) {
    const item = obj[prop];
    const now = new Date();

    if (item && item.expires > now) {
      return item.items;
    }
    return [];
  },
};

// This is a proxied object that allows us to handle the expirations when fetching cached objects
const Cache = new Proxy(RawListItemCache, CacheProxyHandler);

export default Cache;
