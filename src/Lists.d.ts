interface MetaData {
  Title: string | null;
  FileSystemObjectType: number;
  Id: number;
  ServerRedirectedEmbedUri: null | string;
  ServerRedirectedEmbedUrl: string;
  ID: number;
  ContentTypeId: string;
  Modified: string;
  Created: string;
  AuthorId: number;
  EditorId: number;
  OData__UIVersionString: string;
  Attachments: boolean;
  GUID: string;
  ComplianceAssetId: null | number;
}

interface LocationData {
  Address: string;
  CountryOrRegion: string;
  State: string;
  City: string;
  PostalCode: string;
  Street: string;
  GeoLoc: string;
}

type ServiceType = "Cell" | "PTT" | "Data" | string;
type DeviceType = "Phone" | "Laptop" | "Tablet" | string;

type NotRequiredString = string | null;

interface WorkUnit extends MetaData, LocationData {
  Title: string;
  WU_Number: string;
  DispName: string;
  ForeignLabel: string;
}

interface Device extends MetaData {
  ServiceType: ServiceType[];
  DeviceType: DeviceType;
  Phone_Number: NotRequiredString;
  Phone: string;
  Model: NotRequiredString;
  Tag: NotRequiredString;
  Manufacturer: NotRequiredString;
  Existing_Comments: NotRequiredString;
  Foreign_Label: string;
}

interface Assignment extends MetaData {
  DeviceId: number;
  PersonId: number;
  Status: "Active" | "In Review / Zero Usage" | "Returned" | string;
}

interface User extends MetaData {
  Email: NotRequiredString;
  Level: NotRequiredString;
  UnitId: number;
  Title: string;
  First_Name: string;
  Last_Name: string;
  Foreign_Label: string;
  PMS: string;
  Original_WU_Number?: string;
  Original_Work_Location?: string;
}

type ListMap = {
  WorkUnit: WorkUnit;
  Device: Device;
  Assignment: Assignment;
  User: User;
};

type AllLists = keyof ListMap;
