export const SHAREPOINT_URL = "https://nycdot.sharepoint.com/sites/RRM_dev";
export const ALL_LISTS: ListName[] = [
  "Assignments",
  "Comments",
  "Devices",
  "Users",
  "WorkUnits",
  "ZeroUsages",
];

const METADATA_FIELDS: (keyof MetaData)[] = [
  "Title",
  "FileSystemObjectType",
  "Id",
  "ServerRedirectedEmbedUri",
  "ServerRedirectedEmbedUrl",
  "ID",
  "ContentTypeId",
  "Modified",
  "Created",
  "AuthorId",
  "EditorId",
  "OData__UIVersionString",
  "Attachments",
  "GUID",
  "ComplianceAssetId",
];

const CREATION_PROPS_FIELDS: { [key in keyof CreationPropsMap]: (keyof CreationPropsMap[key])[] } =
  {
    Assignments: ["UserId", "Status", "DeviceId", "ReturnedAt"],
    Comments: ["DeviceId", "AssignmentId", "Comment"],
    Devices: ["Model", "Manufacturer", "Phone", "DeviceType", "ServiceType", "Tag"],
    Users: [
      "Email",
      "FirstName",
      "LastName",
      "Level",
      "PMS",
      "RawWorkUnitAddress",
      "RawWorkUnitNumber",
      "RawWorkUnitTitle",
      "Title",
      "WorkUnitId",
    ],
    WorkUnits: ["Address", "Number", "Title"],
    ZeroUsages: ["AssignmentId", "Contacted", "Message", "Status"],
  };

export const LIST_FIELDS: { [key in ListName]: (keyof ListDataMap[key])[] } = ALL_LISTS.reduce(
  (obj, listName) => {
    obj[listName] = Array.from(new Set([...METADATA_FIELDS, ...CREATION_PROPS_FIELDS[listName]]));
    return obj;
  },
  {}
) as { [key in ListName]: (keyof ListDataMap[key])[] };

console.log(LIST_FIELDS);
