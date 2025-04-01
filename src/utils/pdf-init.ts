import * as pdfjsLib from "pdfjs-dist"

// Initialize PDF.js
export function initPdfJs() {
  // Set the worker source with the correct version
  // The version in the URL was incorrect (4.10.38), causing 404 errors
  const pdfJsVersion = pdfjsLib.version || "3.11.174" // Fallback to a known version if version is undefined
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfJsVersion}/pdf.worker.min.js`

  console.log(`PDF.js worker initialized with version: ${pdfJsVersion}`)
}

