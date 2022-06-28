import DataLoader from "dataloader";
import ListItemCache from "./ListItemCache";

const DataLoaderCacheMap = {};
const loaders: {
  [key: string]: { [key: string]: DataLoader<any, any> };
} = {};

export default function getFindOneDataloader<L extends ListName, K extends keyof ListDataMap[L]>(
  list: L,
  key: K
): DataLoader<ListDataMap[L][K], ListDataMap[L]> {
  if (!loaders[list]) {
    loaders[list] = {};
  }

  if (!loaders[list][key as string]) {
    loaders[list][key as string] = new DataLoader<ListDataMap[L][K], ListDataMap[L]>(
      async (keys) => {
        const { items } = ListItemCache.get(list);

        const map: { [key: string | symbol | number]: ListDataMap[L] } = {};

        items.forEach((item) => (map[item[key] as string] = item as ListDataMap[L]));

        return keys.map((k) => map[k as string] || null);
      },
      { cache: false }
    );
  }

  return loaders[list][key as string];
}

export const UserIdLoader = getFindOneDataloader("Users", "ID");
export const DeviceIdLoader = getFindOneDataloader("Devices", "ID");
export const DevicePhoneNumberLoader = getFindOneDataloader("Devices", "Phone");
export const WorkUnitIdLoader = getFindOneDataloader("WorkUnits", "Id");
