import api from "../sharepoint/api";

type API_Response<L extends ListName> = {
  "odata.metatdata": string;
  "odata.nextLink"?: string;
  value: ListDataMap[L][];
};

export default async function getAllListItemsFromServer<List extends ListName>(
  list: List
): Promise<ListDataMap[List][]> {
  const items = [];

  const { data } = await api.get<API_Response<List>>(`lists/getByTitle('${list}')/items`);
  items.push(...data.value);

  let nextLink = data["odata.nextLink"];

  while (nextLink) {
    const res = await api.get<API_Response<List>>(nextLink);
    items.push(...res.data.value);
    nextLink = res.data["odata.nextLink"];
  }

  return items;
}
