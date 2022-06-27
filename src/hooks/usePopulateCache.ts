import { useCallback, useContext, useEffect, useState } from "react";
import SPContext from "../comps/context/SPContext";
import { ALL_LISTS } from "../constants";
import ListItemCache from "../utils/ListItemCache";
import { ListChangeEmitter } from "./useSubscribeToCacheChanges";

const maxCacheAge = 1000 * 60 * 2; // 2 minutes

export default function usePopulateCache<List extends ListName>() {
  const [listsUpdating, setListsUpdating] = useState<ListName[]>([]);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const { sp } = useContext(SPContext);
  const [refreshTimeouts, setRefreshTimeouts] = useState<{
    [key: string]: ReturnType<typeof setTimeout>;
  }>({});

  const populate = useCallback(
    (list: ListName) => {
      if (listsUpdating.includes(list)) {
        return;
      }

      setListsUpdating((prev) => [...prev, list]);

      sp.web.lists
        .getByTitle(list)
        .items<ListDataMap[List][]>()
        .then((items) => {
          ListItemCache.set(list, items);
        })
        .catch((er) => {
          alert("There was an error loading the data from the list " + list);
          alert(er.message);

          throw new Error(er);
        })
        .finally(() => {
          setListsUpdating((current) => current.filter((l) => l !== list));

          const currentTimeout = refreshTimeouts[list];
          if (typeof currentTimeout !== "undefined") {
            clearTimeout(currentTimeout);
          }

          const newTimeout = setTimeout(() => {
            populate(list);
          }, maxCacheAge);

          setRefreshTimeouts((prev) => ({ ...prev, [list]: newTimeout }));
        });
    },
    [listsUpdating]
  );

  const listener = useCallback(
    (listWithUpdates: ListName) => {
      populate(listWithUpdates);
    },
    [populate]
  );

  // Load the list for the first time on load
  useEffect(() => {
    if (!initialLoadComplete) {
      ALL_LISTS.forEach((list) => populate(list));
      setInitialLoadComplete(true);
    }
  }, [initialLoadComplete, populate]);

  useEffect(() => {
    ListChangeEmitter.addListener("change", listener);

    return () => {
      ListChangeEmitter.removeListener("change", listener);
    };
  }, [listener]);

  return listsUpdating;
}
