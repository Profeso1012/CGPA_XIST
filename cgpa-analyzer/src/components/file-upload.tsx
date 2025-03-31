"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Upload, FileText, CheckCircle, AlertCircle, Save, Eye, ArrowRight, AlertTriangle, Brain } from "lucide-react"
import { extractDataFromPDF, getMockTranscriptData } from "../utils/pdf-extractor"
import type { SemesterData, SavedTranscriptData } from "../types"
import { motion } from "framer-motion"

// Helper function to safely format numbers
const safeNumberFormat = (value: number | undefined | null): string => {
  if (value === undefined || value === null || isNaN(value)) {
    return "0.00"
  }
  return value.toFixed(2)
}

interface FileUploadProps {
  onDataExtracted: (data: SemesterData[]) => void
  setIsLoading: (loading: boolean) => void
}

export default function FileUpload({ onDataExtracted, setIsLoading }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState<"idle" | "uploading" | "processing" | "success" | "error" | "warning">("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const [extractedData, setExtractedData] = useState<SemesterData[] | null>(null)
  const [saveName, setSaveName] = useState("")
  const [savedDataList, setSavedDataList] = useState<SavedTranscriptData[]>([])
  const [showSavedDataDialog, setShowSavedDataDialog] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Load saved data list on component mount
  useEffect(() => {
    const savedDataStr = localStorage.getItem("savedTranscriptData")
    if (savedDataStr) {
      try {
        const parsed = JSON.parse(savedDataStr) as SavedTranscriptData[]
        setSavedDataList(parsed)
      } catch (e) {
        console.error("Error parsing saved data:", e)
      }
    }
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      if (selectedFile.type !== "application/pdf") {
        setStatus("error")
        setErrorMessage("Please upload a PDF file")
        return
      }

      setFile(selectedFile)
      setStatus("idle")
      setProgress(0)
      setErrorMessage("")
      setExtractedData(null)
    }
  }

  const handleUpload = async () => {
    if (!file) return

    try {
      setStatus("uploading")
      setIsLoading(true)
      setProgress(0)

      // Simulate initial upload progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 30) {
            clearInterval(progressInterval)
            return 30
          }
          return prev + 5
        })
      }, 200)

      // Process the PDF file
      setStatus("processing")
      setProgress(30)

      // Update progress to show AI processing
      setTimeout(() => {
        setProgress(50)
      }, 1000)

      let extractedData: SemesterData[]

      try {
        // Extract data using LLM
        extractedData = await extractDataFromPDF(file)

        // Update progress
        setProgress(90)

        // Check if we got valid data
        if (extractedData.length === 0) {
          setStatus("warning")
          setErrorMessage(
            "Could not extract semester data from the PDF. Please check the file format or try manual input.",
          )
          extractedData = getMockTranscriptData()
        } else if (extractedData.some((sem) => sem.tnu === 0 || sem.tcp === 0)) {
          setStatus("warning")
          setErrorMessage("Some semester data may be incomplete. Please verify the extracted information.")
        } else {
          setStatus("success")
        }

        // Calculate CGPA for each semester if not already provided
        let cumulativeTCP = 0
        let cumulativeTNU = 0

        extractedData = extractedData.map((semester, index) => {
          // Ensure numeric values are valid
          const tnu = isNaN(semester.tnu) ? 0 : semester.tnu
          const tcp = isNaN(semester.tcp) ? 0 : semester.tcp

          cumulativeTCP += tcp
          cumulativeTNU += tnu
          const calculatedCGPA = cumulativeTNU > 0 ? cumulativeTCP / cumulativeTNU : 0

          return {
            ...semester,
            tnu,
            tcp,
            gpa: isNaN(semester.gpa) ? 0 : semester.gpa,
            cgpa: isNaN(semester.cgpa) ? calculatedCGPA : semester.cgpa,
            courses: semester.courses.map((course) => ({
              ...course,
              units: isNaN(course.units) ? 0 : course.units,
              score: isNaN(course.score) ? 0 : course.score,
              gradePoint: isNaN(course.gradePoint) ? 0 : course.gradePoint,
            })),
          }
        })
      } catch (error) {
        console.error("Error during extraction:", error)
        setStatus("error")
        setErrorMessage("Failed to extract data from the PDF. Please try again or use manual input.")
        extractedData = getMockTranscriptData()
      }

      setProgress(100)
      setExtractedData(extractedData)
      setSaveName(file.name.replace(".pdf", ""))

      // Store the data but don't navigate automatically
      localStorage.setItem("currentExtractedData", JSON.stringify(extractedData))
    } catch (error) {
      setStatus("error")
      setErrorMessage(error instanceof Error ? error.message : "Failed to process the file")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveJSON = () => {
    if (!extractedData || !saveName.trim()) return

    const savedData: SavedTranscriptData = {
      name: saveName,
      date: new Date().toISOString(),
      semesters: extractedData,
    }

    // Get existing saved data
    const existingSavedDataStr = localStorage.getItem("savedTranscriptData")
    let savedDataList: SavedTranscriptData[] = []

    if (existingSavedDataStr) {
      try {
        savedDataList = JSON.parse(existingSavedDataStr)
      } catch (e) {
        console.error("Error parsing saved data:", e)
      }
    }

    // Add new data
    savedDataList.push(savedData)
    setSavedDataList(savedDataList)

    // Save back to localStorage
    localStorage.setItem("savedTranscriptData", JSON.stringify(savedDataList))
    localStorage.setItem("transcriptData", JSON.stringify(extractedData))

    alert(`Saved "${saveName}" successfully!`)
  }

  const handleLoadSavedData = () => {
    const savedDataStr = localStorage.getItem("savedTranscriptData")
    if (savedDataStr) {
      try {
        const parsed = JSON.parse(savedDataStr) as SavedTranscriptData[]
        setSavedDataList(parsed)
        setShowSavedDataDialog(true)
      } catch (e) {
        console.error("Error parsing saved data:", e)
        setStatus("error")
        setErrorMessage("Failed to load saved data")
      }
    } else {
      setStatus("error")
      setErrorMessage("No saved data found")
    }
  }

  const handleSelectSavedData = (data: SavedTranscriptData) => {
    // Validate the data to prevent NaN values
    const validatedData = data.semesters.map((semester) => ({
      ...semester,
      tnu: isNaN(semester.tnu) ? 0 : semester.tnu,
      tcp: isNaN(semester.tcp) ? 0 : semester.tcp,
      gpa: isNaN(semester.gpa) ? 0 : semester.gpa,
      cgpa: isNaN(semester.cgpa) ? 0 : semester.cgpa,
      courses: semester.courses.map((course) => ({
        ...course,
        units: isNaN(course.units) ? 0 : course.units,
        score: isNaN(course.score) ? 0 : course.score,
        gradePoint: isNaN(course.gradePoint) ? 0 : course.gradePoint,
      })),
    }))

    setExtractedData(validatedData)
    setSaveName(data.name)
    setShowSavedDataDialog(false)
    setStatus("success")
    setProgress(100)
  }

  const handleContinueToSimulator = () => {
    if (extractedData) {
      onDataExtracted(extractedData)
    }
  }

  // Calculate CGPA from semester data
  const calculateCGPA = (semesters: SemesterData[]): number => {
    const totalTCP = semesters.reduce((sum, semester) => sum + (isNaN(semester.tcp) ? 0 : semester.tcp), 0)
    const totalTNU = semesters.reduce((sum, semester) => sum + (isNaN(semester.tnu) ? 0 : semester.tnu), 0)
    return totalTNU > 0 ? totalTCP / totalTNU : 0
  }

  return (
    <div className="space-y-6">
      <motion.div
        className="border-2 border-dashed border-cgpa-blue/30 dark:border-cgpa-blue/20 rounded-lg p-8 text-center bg-gradient-to-b from-blue-50 to-white dark:from-cgpa-navy-light dark:to-cgpa-navy"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col items-center justify-center space-y-4">
          <motion.div
            className="w-20 h-20 rounded-full bg-cgpa-blue/10 flex items-center justify-center"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 3 }}
          >
            <Upload className="h-10 w-10 text-cgpa-blue" />
          </motion.div>
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-cgpa-blue">Upload your transcript</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Upload a PDF of your academic transcript to automatically extract your grades using AI
            </p>
          </div>
          <input
            id="file-upload"
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={handleFileChange}
            ref={fileInputRef}
          />
          <div className="flex flex-wrap gap-2 justify-center">
            <label
              htmlFor="file-upload"
              className="cursor-pointer inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-cgpa-blue hover:bg-cgpa-blue-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cgpa-blue transition-all duration-300 animate-bounce-light"
            >
              Select PDF File
            </label>
            <button
              onClick={handleLoadSavedData}
              className="inline-flex items-center border border-cgpa-blue text-cgpa-blue hover:bg-cgpa-blue/10 px-4 py-2 rounded-md text-sm font-medium"
            >
              <Eye className="h-4 w-4 mr-2" /> Load Saved Data
            </button>
          </div>
        </div>
      </motion.div>

      {file && (
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-center space-x-3 p-3 bg-white dark:bg-cgpa-navy-light rounded-lg shadow-sm">
            <FileText className="h-5 w-5 text-cgpa-blue" />
            <span className="text-sm font-medium">{file.name}</span>
          </div>

          {status !== "idle" && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>
                  {status === "uploading" && "Uploading..."}
                  {status === "processing" && (
                    <span className="flex items-center">
                      <Brain className="h-4 w-4 mr-2 animate-pulse text-cgpa-blue" />
                      Processing with AI...
                    </span>
                  )}
                  {status === "success" && "Processing complete!"}
                  {status === "warning" && "Processing complete with warnings"}
                  {status === "error" && "Error processing file"}
                </span>
                <span>{progress}%</span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cgpa-blue to-cgpa-gold rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {status === "success" && (
            <div className="flex items-center text-green-600 space-x-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <CheckCircle className="h-5 w-5" />
              <span>Successfully extracted your academic data!</span>
            </div>
          )}

          {status === "warning" && (
            <div className="bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-700 border rounded-lg p-4">
              <div className="flex items-center">
                <AlertTriangle className="h-4 w-4 text-yellow-500 mr-2" />
                <div className="font-medium text-yellow-700 dark:text-yellow-400">Warning</div>
              </div>
              <div className="mt-2 text-sm text-yellow-600 dark:text-yellow-300">{errorMessage}</div>
            </div>
          )}

          {status === "error" && (
            <div className="flex items-center text-red-600 space-x-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <AlertCircle className="h-5 w-5" />
              <span>{errorMessage || "Failed to process the file. Please try again."}</span>
            </div>
          )}

          {status === "idle" && (
            <button
              onClick={handleUpload}
              className="w-full bg-gradient-to-r from-cgpa-blue to-cgpa-gold text-white hover:opacity-90 px-4 py-2 rounded-md"
            >
              <Brain className="h-4 w-4 mr-2 inline-block" /> Process with AI
            </button>
          )}
        </motion.div>
      )}

      {extractedData && (
        <motion.div
          className="space-y-4 mt-6 p-4 border rounded-lg bg-white dark:bg-cgpa-navy-light shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-cgpa-blue">Extracted Data Summary</h3>
            <div className="flex items-center space-x-2">
              <div className="w-48">
                <label htmlFor="save-name" className="sr-only">
                  Save Name
                </label>
                <input
                  id="save-name"
                  value={saveName}
                  onChange={(e) => setSaveName(e.target.value)}
                  placeholder="Enter a name to save"
                  className="w-full px-3 py-2 border border-cgpa-blue/30 focus:border-cgpa-blue focus:ring-cgpa-blue rounded-md"
                />
              </div>
              <button
                onClick={handleSaveJSON}
                disabled={!saveName.trim()}
                className="border border-cgpa-gold text-cgpa-gold hover:bg-cgpa-gold/10 px-3 py-1 rounded-md text-sm font-medium inline-flex items-center"
              >
                <Save className="h-4 w-4 mr-2" />
                Save
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-cgpa-blue/10 to-cgpa-blue/5 dark:from-cgpa-blue/20 dark:to-cgpa-blue/10 p-4 rounded-lg shadow-sm">
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Semesters</div>
                <div className="text-2xl font-bold text-cgpa-blue">{extractedData.length}</div>
              </div>

              <div className="bg-gradient-to-br from-cgpa-gold/10 to-cgpa-gold/5 dark:from-cgpa-gold/20 dark:to-cgpa-gold/10 p-4 rounded-lg shadow-sm">
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Current CGPA</div>
                <div className="text-2xl font-bold text-cgpa-gold">
                  {safeNumberFormat(extractedData[extractedData.length - 1]?.cgpa)}
                </div>
              </div>

              <div className="bg-gradient-to-br from-cgpa-blue/10 to-cgpa-blue/5 dark:from-cgpa-blue/20 dark:to-cgpa-blue/10 p-4 rounded-lg shadow-sm">
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Credit Units</div>
                <div className="text-2xl font-bold text-cgpa-blue">
                  {extractedData.reduce((sum, sem) => sum + (isNaN(sem.tnu) ? 0 : sem.tnu), 0)}
                </div>
              </div>
            </div>

            <div className="max-h-60 overflow-y-auto rounded-lg border border-gray-200 dark:border-gray-700">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-100 dark:bg-gray-800 sticky top-0">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Semester
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      TNU
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      TCP
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      GPA
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      CGPA
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-cgpa-navy divide-y divide-gray-200 dark:divide-gray-800">
                  {extractedData.map((semester) => (
                    <tr key={semester.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="px-4 py-2 text-sm">{semester.name}</td>
                      <td className="px-4 py-2 text-sm">{isNaN(semester.tnu) ? 0 : semester.tnu}</td>
                      <td className="px-4 py-2 text-sm">{isNaN(semester.tcp) ? 0 : semester.tcp}</td>
                      <td className="px-4 py-2 text-sm font-medium text-cgpa-blue">{safeNumberFormat(semester.gpa)}</td>
                      <td className="px-4 py-2 text-sm font-medium text-cgpa-gold">
                        {safeNumberFormat(semester.cgpa)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleContinueToSimulator}
                className="mt-4 bg-gradient-to-r from-cgpa-blue to-cgpa-gold text-white hover:opacity-90 animate-pulse-light px-4 py-2 rounded-md inline-flex items-center"
              >
                Continue to Simulator <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Dialog for selecting saved data */}
      {showSavedDataDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-cgpa-navy-light rounded-lg max-w-md w-full p-6 max-h-[80vh] overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-cgpa-blue">Select Saved Data</h3>
              <button onClick={() => setShowSavedDataDialog(false)} className="text-gray-500 hover:text-gray-700">
                ✕
              </button>
            </div>
            <div className="max-h-[60vh] overflow-y-auto">
              {savedDataList.length > 0 ? (
                <div className="space-y-2">
                  {savedDataList.map((data, index) => (
                    <div
                      key={index}
                      className="p-3 border border-gray-200 dark:border-gray-700 rounded-md cursor-pointer hover:bg-cgpa-blue/5 dark:hover:bg-cgpa-blue/10 transition-colors"
                      onClick={() => handleSelectSavedData(data)}
                    >
                      <div className="font-medium text-cgpa-blue">{data.name}</div>
                      <div className="text-sm text-gray-500">
                        {new Date(data.date).toLocaleString()} • {data.semesters.length} semesters • CGPA:{" "}
                        <span className="text-cgpa-gold font-medium">
                          {safeNumberFormat(calculateCGPA(data.semesters))}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500">No saved data found</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

