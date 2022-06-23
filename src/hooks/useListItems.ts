import { useState } from "react";
import useSubscribeToListChanges from "./useSubscribeToListChanges";

export default function useListItems<List extends ListName>(list: List) {
  const [items, setItems] = useState<ListDataMap[List][]>([]);
  useSubscribeToListChanges(list);
}
