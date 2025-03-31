"use client"

import { useEffect } from "react"
import { initPdfJs } from "./utils/pdf-init"

export default function App() {
  // Initialize PDF.js when the app loads
  useEffect(() => {
    initPdfJs()
  }, [])

  // Redirect to the home page
  useEffect(() => {
    window.location.href = "/"
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Redirecting to the new CGPA Analyzer...</p>
    </div>
  )
}

