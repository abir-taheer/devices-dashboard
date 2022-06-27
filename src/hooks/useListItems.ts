import ListItemCache from "../utils/ListItemCache";
import useSubscribeToCacheChanges from "./useSubscribeToCacheChanges";

export default function useListItems<List extends ListName>(list: List) {
  useSubscribeToCacheChanges(list);

  return ListItemCache.get(list);
}
