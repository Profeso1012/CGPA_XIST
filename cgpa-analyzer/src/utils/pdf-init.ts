import * as pdfjsLib from "pdfjs-dist"

// Initialize PDF.js
export function initPdfJs() {
  // Set the worker source
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`
}

