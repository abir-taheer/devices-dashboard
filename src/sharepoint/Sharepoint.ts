import api from "./api";
import getFormDigest from "./getFormDigest";

export type SharepointListItemsResponse<List extends AllLists> = {
  "odata.nextLink"?: string;
  value: Array<ListMap[List]>;
};

export default class Sharepoint {
  public static async getAllListItems<List extends AllLists>(
    list: List
  ): Promise<Array<ListMap[List]>> {
    const requestUrl = `lists/getbytitle('${list}')/items`;

    let values: Array<ListMap[List]> = [];

    let nextUrl: string = requestUrl;

    while (nextUrl) {
      const { data } = await api.get<SharepointListItemsResponse<List>>(nextUrl);

      nextUrl = data["odata.nextLink"] || "";
      values = [...values, ...data.value];
    }

    return values;
  }

  public static async getListItem<List extends AllLists>(
    list: List,
    id: ListMap[List]["Id"]
  ): Promise<ListMap[List]> {
    const requestUrl = `lists/getbytitle('${list}')/items(${id})`;
    const { data } = await api.get<ListMap[List]>(requestUrl);
    return data;
  }

  public static async updateListItem<List extends AllLists>(
    list: List,
    id: ListMap[List]["Id"],
    data: Partial<ListMap[List]>
  ): Promise<ListMap[List]> {
    const formDigest = await getFormDigest();
    const requestUrl = `lists/getbytitle('${list}')/items(${id})`;

    const res = await api.post<ListMap[List]>(requestUrl, data, {
      headers: {
        "X-HTTP-Method": "MERGE",
        "X-RequestDigest": formDigest,
      },
    });

    return res.data;
  }
}
