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

type ServiceTypeValue = "Cell" | "PTT" | "Data" | string;
type DeviceTypeValue = "Phone" | "Laptop" | "Tablet" | string;
type ZeroUsageStatusValue = "resolved" | "unresolved" | "pending";

type NotRequiredString = string | null;

type UserCreationProps = {
  Title: string;
  Level: string;
  FirstName: string;
  LastName: string;
  PMS: string;
  Email: string;
  WorkUnitId: number;
  RawWorkUnitNumber: string;
  RawWorkUnitTitle: string;
  RawWorkUnitAddress: string;
};

type DeviceCreationProps = {
  Model: string;
  Manufacturer: string;
  Phone: string;
  DeviceType: DeviceTypeValue;
  ServiceType: ServiceTypeValue;
  Tag: string;
};

type AssignmentCreationProps = {
  UserId: number;
  Status: string;
  DeviceId: number;

  // ISO-encoded time string
  ReturnedAt: string;
};

type WorkUnitCreationProps = {
  Title: string;
  Number: string;
  RawAddress: string;
  Address?: LocationData;
};

type CommentCreationProps = {
  DeviceId: number;
  AssignmentId: number;
  Comment: string;
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

type UserData = MetaData & UserCreationProps;
type DeviceData = MetaData & DeviceCreationProps;
type WorkUnitData = MetaData & WorkUnitCreationProps;
type AssignmentData = MetaData & AssignmentCreationProps;
type CommentData = MetaData & CommentCreationProps;
type ZeroUsageData = MetaData & ZeroUsageCreationProps;

type ListDataMap = {
  Users: UserData;
  Devices: DeviceData;
  WorkUnits: WorkUnitData;
  Assignments: AssignmentData;
  Comments: CommentData;
  ZeroUsages: ZeroUsageData;
};
