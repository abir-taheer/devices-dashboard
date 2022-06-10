import axios from "axios";
import { SHAREPOINT_URL } from "../constants";

const api = axios.create({
  baseURL: SHAREPOINT_URL + "/_api/",
  withCredentials: true,
  headers: {
    Accept: "application/json;odata=nometadata",
  },
});

export default api;
