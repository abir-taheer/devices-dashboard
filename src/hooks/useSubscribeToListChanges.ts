import { useCallback, useEffect, useState } from "react";
import EventEmitter from "events";

export const ListChangeEmitter = new EventEmitter();

export default function useSubscribeToListChanges<List extends ListName>(list: List) {
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
    ListChangeEmitter.addListener("change", listener);

    return () => {
      ListChangeEmitter.removeListener("change", listener);
    };
  }, [listener]);

  return version;
}
