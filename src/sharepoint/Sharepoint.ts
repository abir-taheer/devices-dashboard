import api from "./api";
import getFormDigest from "./getFormDigest";

export type SharepointListItemsResponse<List extends ListName> = {
  "odata.nextLink"?: string;
  value: Array<ListDataMap[List]>;
};

export default class Sharepoint {
  public static async getAllListItems<List extends ListName>(
    list: List
  ): Promise<Array<ListDataMap[List]>> {
    const requestUrl = `lists/getbytitle('${list}')/items`;

    let values: Array<ListDataMap[List]> = [];

    let nextUrl: string = requestUrl;

    while (nextUrl) {
      const { data } = await api.get<SharepointListItemsResponse<List>>(nextUrl);

      nextUrl = data["odata.nextLink"] || "";
      values = [...values, ...data.value];
    }

    return values;
  }

  public static async getListItem<List extends ListName>(
    list: List,
    id: ListDataMap[List]["Id"]
  ): Promise<ListDataMap[List]> {
    const requestUrl = `lists/getbytitle('${list}')/items(${id})`;
    const { data } = await api.get<ListDataMap[List]>(requestUrl);
    return data;
  }

  public static async updateListItem<List extends ListName>(
    list: List,
    id: ListDataMap[List]["Id"],
    data: Partial<ListDataMap[List]>
  ): Promise<ListDataMap[List]> {
    const formDigest = await getFormDigest();
    const requestUrl = `lists/getbytitle('${list}')/items(${id})`;

    const res = await api.post<ListDataMap[List]>(requestUrl, data, {
      headers: {
        "X-HTTP-Method": "MERGE",
        "X-RequestDigest": formDigest,
      },
    });

    return res.data;
  }
}
