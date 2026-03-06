import axios from "axios";

export const generatePDF = (data: unknown) => {
  return axios.post("https://timber-bill-generator-backend.onrender.com/generate-pdf", data, {
    responseType: "blob",
  });
};