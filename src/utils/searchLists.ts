import { CREATION_PROPS_FIELDS } from "../constants";
import ListItemCache from "./ListItemCache";

export default function searchLists<Fields extends ListName>(
  query: string,
  lists: Fields[],
  maxResults: number = 10
) {
  // Get all of the unique words from the query
  const words = Array.from(
    new Set(
      query
        .toLowerCase()
        .replace(/[^a-z0-9 ]/g, "")
        .split(/\s+/)
        .filter(Boolean)
    )
  );

  type MatchArray = { list: Fields; score: number; item: ListDataMap[Fields] }[];

  // Find all rows that match at least 70% of the words that were included in the search
  const matches: MatchArray = lists
    .reduce((arr, list) => {
      const { items } = ListItemCache.get(list);

      const possibles = words.length
        ? items.map((item) => ({
            score:
              words.filter((word) =>
                CREATION_PROPS_FIELDS[list].some((field) =>
                  item[field]
                    ?.toString()
                    ?.toLowerCase()
                    .replace(/[^a-z0-9 ]/g, "")
                    .includes(word.toLowerCase())
                )
              ).length / words.length,
            item,
            list,
          }))
        : items.map((item) => ({ score: 1, item, list } as const));

      return arr.concat(possibles);
    }, [] as unknown as MatchArray)
    .filter((item) => item.score >= 0.7)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults);

  return matches;
}
