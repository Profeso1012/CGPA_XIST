"use client"

import { useState, useEffect } from "react"
import FileUpload from "../../components/file-upload"
import ManualInput from "../../components/manual-input"
import Simulator from "../../components/simulator"
import Results from "../../components/results"
import type { SemesterData, SimulationResult } from "../../types"
import { initPdfJs } from "../../utils/pdf-init"
import { motion } from "framer-motion"

// Helper function to safely format numbers
const safeNumberFormat = (value: number | undefined | null): string => {
  if (value === undefined || value === null || isNaN(value)) {
    return "0.00"
  }
  return value.toFixed(2)
}

export default function RunPage() {
  const [semesters, setSemesters] = useState<SemesterData[]>([])
  const [simulationResults, setSimulationResults] = useState<SimulationResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("upload")

  // Initialize PDF.js when the app loads
  useEffect(() => {
    initPdfJs()
  }, [])

  // Add useEffect to check for saved data on component mount
  useEffect(() => {
    const savedData = localStorage.getItem("transcriptData")
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData) as SemesterData[]
        // Ensure all numeric values are valid
        const validatedData = parsedData.map((semester) => ({
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
        setSemesters(validatedData)
      } catch (error) {
        console.error("Error loading saved data:", error)
      }
    }
  }, [])

  // Update the handleDataExtracted function to be more robust
  const handleDataExtracted = (extractedSemesters: SemesterData[]) => {
    // Validate the data to prevent NaN values
    const validatedData = extractedSemesters.map((semester) => ({
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
    setSemesters(validatedData)
    setActiveTab("simulator")
  }

  const handleManualInput = (manualSemesters: SemesterData[]) => {
    // Validate the data to prevent NaN values
    const validatedData = manualSemesters.map((semester) => ({
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
    setSemesters(validatedData)
    setActiveTab("simulator")
  }

  const handleSimulationResults = (results: SimulationResult) => {
    // Validate the simulation results to prevent NaN values
    const validatedResults: SimulationResult = {
      currentCGPA: isNaN(results.currentCGPA) ? 0 : results.currentCGPA,
      currentTotalTCP: isNaN(results.currentTotalTCP) ? 0 : results.currentTotalTCP,
      currentTotalTNU: isNaN(results.currentTotalTNU) ? 0 : results.currentTotalTNU,
      scenarios: results.scenarios.map((scenario) => ({
        ...scenario,
        targetCGPA: isNaN(scenario.targetCGPA) ? 0 : scenario.targetCGPA,
        finalCGPA: isNaN(scenario.finalCGPA) ? 0 : scenario.finalCGPA,
        minimumRequiredGPA: isNaN(scenario.minimumRequiredGPA) ? 0 : scenario.minimumRequiredGPA,
        futureSemesters: scenario.futureSemesters.map((semester) => ({
          ...semester,
          tnu: isNaN(semester.tnu) ? 0 : semester.tnu,
          tcp: isNaN(semester.tcp) ? 0 : semester.tcp,
          gpa: isNaN(semester.gpa) ? 0 : semester.gpa,
          cgpa: isNaN(semester.cgpa) ? 0 : semester.cgpa,
          courses: semester.courses
            ? semester.courses.map((course) => ({
                ...course,
                units: isNaN(course.units) ? 0 : course.units,
                score: isNaN(course.score) ? 0 : course.score,
                gradePoint: isNaN(course.gradePoint) ? 0 : course.gradePoint,
              }))
            : [],
        })),
      })),
    }
    setSimulationResults(validatedResults)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 dark:from-cgpa-navy-dark dark:to-cgpa-navy-light p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <motion.header
          className="mb-8 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-gradient">CGPA Analyzer</h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Upload your transcript or manually input your scores to analyze and simulate your CGPA
          </p>
        </motion.header>

        {/* Custom Tabs */}
        <div className="w-full">
          {/* Tab Navigation */}
          <div className="grid w-full grid-cols-3 mb-8 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
            <button
              onClick={() => setActiveTab("upload")}
              className={`py-2 px-4 text-sm font-medium transition-colors ${
                activeTab === "upload"
                  ? "bg-cgpa-blue text-white"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              Upload Transcript
            </button>
            <button
              onClick={() => setActiveTab("manual")}
              className={`py-2 px-4 text-sm font-medium transition-colors ${
                activeTab === "manual"
                  ? "bg-cgpa-blue text-white"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              Manual Input
            </button>
            <button
              onClick={() => setActiveTab("simulator")}
              disabled={semesters.length === 0}
              className={`py-2 px-4 text-sm font-medium transition-colors ${
                activeTab === "simulator"
                  ? "bg-cgpa-blue text-white"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              } ${semesters.length === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              Simulator
            </button>
          </div>

          {/* Tab Content */}
          <div>
            {activeTab === "upload" && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <div className="border border-cgpa-blue/20 rounded-lg shadow-lg bg-white dark:bg-gray-900">
                  <div className="p-6">
                    <FileUpload onDataExtracted={handleDataExtracted} setIsLoading={setIsLoading} />
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "manual" && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <div className="border border-cgpa-blue/20 rounded-lg shadow-lg bg-white dark:bg-gray-900">
                  <div className="p-6">
                    <ManualInput onDataSubmitted={handleManualInput} />
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "simulator" && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <div className="border border-cgpa-blue/20 rounded-lg shadow-lg bg-white dark:bg-gray-900">
                  <div className="p-6">
                    <Simulator existingSemesters={semesters} onSimulationComplete={handleSimulationResults} />
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {simulationResults && (
          <motion.div
            className="mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Results results={simulationResults} semesters={semesters} />
          </motion.div>
        )}
      </div>
    </div>
  )
}

