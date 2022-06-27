import EventEmitter from "events";
import { useCallback, useEffect, useState } from "react";
import { CacheChangeEmitter } from "../utils/ListItemCache";

export const ListChangeEmitter = new EventEmitter();

export default function useSubscribeToCacheChanges<List extends ListName>(list: List) {
  const [version, setVersion] = useState(0);

  const listener = useCallback(
    (listName: string) => {
      if (listName === list) {
        setVersion((v) => v + 1);
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
