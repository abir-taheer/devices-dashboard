import EventEmitter from "events";
import { useCallback, useEffect, useState } from "react";
import ListItemCache, { CacheChangeEmitter } from "../lists/ListItemCache";

export const ListChangeEmitter = new EventEmitter();

export default function useSubscribeToCacheChanges<List extends ListName>(list: List) {
  const [version, setVersion] = useState(ListItemCache.get(list).version);

  const listener = useCallback(
    (listName: string) => {
      if (listName === list) {
        setVersion((v) => ListItemCache.get(list).version);
      }
    },
    [setVersion]
  );

  useEffect(() => {
    CacheChangeEmitter.addListener("change", listener);

    return () => {
      CacheChangeEmitter.removeListener("change", listener);
    };
  }, [listener]);

  return version;
}
