declare module 'pdf-parse' {
  interface PDFData {
    text: string;
  }
  
  function PDFParse(buffer: Buffer): Promise<PDFData>;
  export default PDFParse;
} 