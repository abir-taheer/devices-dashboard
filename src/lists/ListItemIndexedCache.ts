import ListItemCache from "./ListItemCache";

type IndexedCacheValue<
  List extends ListName,
  Field extends keyof ListDataMap[List],
  IndexType extends "unique" | "many" = "unique"
> = {
  version: number;
  items: {
    [key: string]: IndexType extends "unique" ? ListDataMap[List] : ListDataMap[List][];
  };
};

type ListItemIndexedCacheValue = {
  [List in ListName]?: {
    [Field in keyof ListDataMap[List]]?: {
      unique?: IndexedCacheValue<List, Field, "unique">;
      many?: IndexedCacheValue<List, Field, "many">;
    };
  };
};

// When an index is requested, it will be generated if it doesn't exist for the current data version otherwise the existing will be returned
const RawListItemIndexedCache: ListItemIndexedCacheValue = {};

export default class ListItemIndexedCache {
  public static getIndex<
    List extends ListName,
    Field extends keyof ListDataMap[List],
    IndexType extends "unique" | "many" = "unique"
  >(list: List, field: Field, type: IndexType): IndexedCacheValue<List, Field, IndexType> {
    const { items, version } = ListItemCache.get(list);

    const existingIndex = RawListItemIndexedCache[list]?.[field]?.[type];

    if (existingIndex && existingIndex.version === version) {
      return existingIndex as IndexedCacheValue<List, Field, IndexType>;
    }

    if (!RawListItemIndexedCache[list]) {
      RawListItemIndexedCache[list] = {};
    }

    if (!RawListItemIndexedCache[list][field]) {
      RawListItemIndexedCache[list][field] = {} as ListItemIndexedCacheValue[List][Field];
    }

    if (!RawListItemIndexedCache[list][field][type]) {
      RawListItemIndexedCache[list][field][type] = {
        version,
        items: {},
      };
    }

    type Item = ListDataMap[List];

    type MapValue = IndexType extends "unique" ? Item : Item[];

    const map: {
      [key: string | number]: MapValue;
    } = {};

    items.forEach((item) => {
      const keyValue = item[field]?.toString();

      if (type == "unique") {
        map[keyValue] = item as MapValue;
      }

      if (type == "many") {
        if (!map[keyValue]) {
          map[keyValue] = [] as MapValue;
        }

        const items = map[keyValue] as Item[];
        items.push(item);
      }
    });

    //@ts-ignore
    RawListItemIndexedCache[list][field][type] = {
      version,
      items: map,
    };

    return {
      version: ListItemCache.get(list).version,
      items: map as IndexedCacheValue<List, Field, IndexType>["items"],
    };
  }
}
