import axios from "axios";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const { PDFParse } = require("pdf-parse");

export const extractTextFromPDF = async (pdfUrl) => {
  const response = await axios.get(pdfUrl, {
    responseType: "arraybuffer",
  });
  const buffer = Buffer.from(response.data);
  const parser = new PDFParse({ data: buffer });
  const result = await parser.getText();
  return result?.text ?? "";
};
