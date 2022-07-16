import DataLoader from "dataloader";
import ListItemCache from "../lists/ListItemCache";

const loaders: {
  [key: string]: { [key: string]: DataLoader<any, any> };
} = {};

export default function getFindManyDataloader<L extends ListName, K extends keyof ListDataMap[L]>(
  list: L,
  key: K
): DataLoader<ListDataMap[L][K], ListDataMap[L][]> {
  if (!loaders[list]) {
    loaders[list] = {};
  }

  if (!loaders[list][key as string]) {
    loaders[list][key as string] = new DataLoader<ListDataMap[L][K], ListDataMap[L][]>(
      async (keys) => {
        const { items } = ListItemCache.get(list);

        const map: { [key: string | symbol | number]: ListDataMap[L][] } = {};

        items.forEach((item) => {
          if (!map[item[key] as string]) {
            map[item[key] as string] = [];
          }

          map[item[key] as string].push(item as ListDataMap[L]);
        });

        return keys.map((k) => map[k as string] || []);
      },
      {
        cache: false,
      }
    );
  }

  return loaders[list][key as string];
}

export const AssignmentDeviceIdLoader = getFindManyDataloader("Assignments", "DeviceId");
