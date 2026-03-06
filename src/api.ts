import axios from "axios";

export const generatePDF = (data: unknown) => {
  return axios.post("http://localhost:5000/generate-pdf", data, {
    responseType: "blob",
  });
};