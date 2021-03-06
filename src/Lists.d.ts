interface LocationData {
  Address: string;
  CountryOrRegion: string;
  State: string;
  City: string;
  PostalCode: string;
  Street: string;
  GeoLoc: string;
}

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

type DeviceTypeValue = "Phone" | "Laptop" | "Tablet" | string;
type NotRequiredString = string | null;
type ServiceTypeValue = "Cell" | "PTT" | "Data" | string;
type ZeroUsageStatusValue = "resolved" | "unresolved" | "pending";

type AssignmentCreationProps = {
  UserId: number;
  Status: "Active" | "Closed";
  DeviceId: DeviceData["Id"];

  // ISO-encoded time string
  ReturnedAt: string;
};

type CommentCreationProps = {
  DeviceId: DeviceData["Id"];
  AssignmentId: AssignmentData["Id"];
  Comment: string;
};

type DeviceCreationProps = {
  Model: string;
  Manufacturer: string;
  Phone: string;
  DeviceType: DeviceTypeValue;
  ServiceType: ServiceTypeValue[];
  Tag: string;
};

type UserCreationProps = {
  Title: string;
  Level: string;
  FirstName: string;
  LastName: string;
  PMS: string;
  Email: string;
  WorkUnitId: WorkUnitData["Id"];
  RawWorkUnitNumber: string;
  RawWorkUnitTitle: string;
  RawWorkUnitAddress: string;
};

type WorkUnitCreationProps = {
  Title: string;
  Number: string;
  Address?: string;
};

type ZeroUsageCreationProps = {
  AssignmentId: number;
  Status: ZeroUsageStatusValue;
  Contacted: boolean;
  Message: string;
};

type CreationPropsMap = {
  Assignments: AssignmentCreationProps;
  Devices: DeviceCreationProps;
  WorkUnits: WorkUnitCreationProps;
  Users: UserCreationProps;
  Comments: CommentCreationProps;
  ZeroUsages: ZeroUsageCreationProps;
};

type AssignmentData = MetaData & AssignmentCreationProps;
type CommentData = MetaData & CommentCreationProps;
type DeviceData = MetaData & DeviceCreationProps;
type UserData = MetaData & UserCreationProps;
type WorkUnitData = MetaData & WorkUnitCreationProps;
type ZeroUsageData = MetaData & ZeroUsageCreationProps;

type ListDataMap = {
  Assignments: AssignmentData;
  Comments: CommentData;
  Devices: DeviceData;
  Users: UserData;
  WorkUnits: WorkUnitData;
  ZeroUsages: ZeroUsageData;
};

type ListName = keyof ListDataMap;
