import axios from "axios";
import config from "./configuration/config.json";

export const generatePDF = (data: unknown) => {
  return axios.post(`${config.apiConfig.apiEndPoint}generate-pdf`, data, {
    responseType: "blob",
  });
};