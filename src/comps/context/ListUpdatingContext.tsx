import { createContext, ReactNode } from "react";
import usePopulateCache from "../../hooks/usePopulateCache";

export const ListUpdatingContext = createContext<ListName[]>([]);

export function ListUpdatingContextProvider({ children }: { children: ReactNode }) {
  const listsUpdating = usePopulateCache();

  return (
    <ListUpdatingContext.Provider value={listsUpdating}>{children}</ListUpdatingContext.Provider>
  );
}
