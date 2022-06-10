import api from "./api";

type ExpectedData = {
  FormDigestTimeoutSeconds: number;
  FormDigestValue: string;
  SiteFullUrl: string;
  SupportedSchemaVersions: string[];
  WebFullUrl: string;
};

export default async function getContextInfo() {
  const response = await api.post<ExpectedData>("contextinfo");
  return response.data;
}
