import { createRequire } from "module";

const require = createRequire(import.meta.url);
const { PDFParse } = require("pdf-parse");

export const extractTextFromPDF = async (pdfUrl) => {
  const parser = new PDFParse({ url: pdfUrl });
  const result = await parser.getText();
  return result?.text ?? "";
};
