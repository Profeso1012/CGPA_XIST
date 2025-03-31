"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2, Save, Eye, ArrowRight } from "lucide-react"
import type { SemesterData, SavedTranscriptData } from "../types"
import { v4 as uuidv4 } from "uuid"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface ManualInputProps {
  onDataSubmitted: (data: SemesterData[]) => void
}

export default function ManualInput({ onDataSubmitted }: ManualInputProps) {
  const [semesters, setSemesters] = useState<SemesterData[]>([
    {
      id: uuidv4(),
      name: "Semester 1",
      courses: [],
      tnu: 0,
      tcp: 0,
      gpa: 0,
      cgpa: 0,
    },
  ])

  const [saveName, setSaveName] = useState("My Academic Record")
  const [savedDataList, setSavedDataList] = useState<SavedTranscriptData[]>([])
  const [showSavedDataDialog, setShowSavedDataDialog] = useState(false)

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

  // Calculate GPA and CGPA whenever TNU or TCP values change
  useEffect(() => {
    if (semesters.length === 0) return

    // Create a deep copy to avoid direct state mutation
    const semestersCopy = JSON.parse(JSON.stringify(semesters))
    let shouldUpdate = false

    let cumulativeTCP = 0
    let cumulativeTNU = 0

    for (let i = 0; i < semestersCopy.length; i++) {
      const semester = semestersCopy[i]

      // Calculate GPA for this semester
      const calculatedGPA = semester.tnu > 0 ? semester.tcp / semester.tnu : 0

      // Update cumulative values
      cumulativeTCP += semester.tcp
      cumulativeTNU += semester.tnu

      // Calculate CGPA up to this semester
      const calculatedCGPA = cumulativeTNU > 0 ? cumulativeTCP / cumulativeTNU : 0

      // Only update if values have changed
      if (Math.abs(semester.gpa - calculatedGPA) > 0.001 || Math.abs(semester.cgpa - calculatedCGPA) > 0.001) {
        shouldUpdate = true
        semester.gpa = calculatedGPA
        semester.cgpa = calculatedCGPA
      }
    }

    // Only update state if values have changed
    if (shouldUpdate) {
      setSemesters(semestersCopy)
    }
  }, [semesters.map((s) => s.tnu).join(","), semesters.map((s) => s.tcp).join(",")])

  const addSemester = () => {
    setSemesters([
      ...semesters,
      {
        id: uuidv4(),
        name: `Semester ${semesters.length + 1}`,
        courses: [],
        tnu: 0,
        tcp: 0,
        gpa: 0,
        cgpa: 0,
      },
    ])
  }

  const removeSemester = (id: string) => {
    setSemesters(semesters.filter((sem) => sem.id !== id))
  }

  const updateSemesterField = (index: number, field: keyof SemesterData, value: string | number) => {
    const updatedSemesters = [...semesters]

    if (field === "name") {
      updatedSemesters[index].name = value as string
    } else if (field === "tnu" || field === "tcp") {
      const numValue = typeof value === "string" ? Number.parseFloat(value) : value
      updatedSemesters[index][field] = numValue
    }

    setSemesters(updatedSemesters)
  }

  const handleSubmit = () => {
    onDataSubmitted(semesters)
  }

  const handleSave = () => {
    if (!saveName.trim()) return

    const savedData: SavedTranscriptData = {
      name: saveName,
      date: new Date().toISOString(),
      semesters: semesters,
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
    localStorage.setItem("transcriptData", JSON.stringify(semesters))

    alert(`Saved "${saveName}" successfully!`)
  }

  const handleLoad = () => {
    setShowSavedDataDialog(true)
  }

  const handleSelectSavedData = (data: SavedTranscriptData) => {
    setSemesters(data.semesters)
    setSaveName(data.name)
    setShowSavedDataDialog(false)
  }

  // Calculate CGPA from semester data
  const calculateCGPA = (semesters: SemesterData[]): number => {
    const totalTCP = semesters.reduce((sum, semester) => sum + semester.tcp, 0)
    const totalTNU = semesters.reduce((sum, semester) => sum + semester.tnu, 0)
    return totalTNU > 0 ? totalTCP / totalTNU : 0
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 bg-gradient-to-r from-cgpa-blue/10 to-transparent p-4 rounded-lg">
        <h2 className="text-xl font-semibold text-gradient">Enter Your Semester Data</h2>
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={addSemester}
            variant="outline"
            size="sm"
            className="border-cgpa-blue text-cgpa-blue hover:bg-cgpa-blue/10 transition-all duration-300"
          >
            <Plus className="h-4 w-4 mr-2" /> Add Semester
          </Button>
          <Button
            onClick={handleLoad}
            variant="outline"
            size="sm"
            className="border-cgpa-gold text-cgpa-gold hover:bg-cgpa-gold/10 transition-all duration-300"
          >
            <Eye className="h-4 w-4 mr-2" /> Load Saved
          </Button>
        </div>
      </div>

      {semesters.length > 0 && (
        <div className="space-y-4 p-4 border rounded-lg bg-gradient-to-br from-blue-50 to-white dark:from-cgpa-navy-light dark:to-cgpa-navy shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Semesters</div>
              <div className="text-2xl font-bold text-cgpa-blue">{semesters.length}</div>
            </div>

            <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Current CGPA</div>
              <div className="text-2xl font-bold text-cgpa-gold">
                {semesters[semesters.length - 1]?.cgpa?.toFixed(2) || "0.00"}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Credit Units</div>
              <div className="text-2xl font-bold text-cgpa-blue">
                {semesters.reduce((sum, sem) => sum + sem.tnu, 0)}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto -mx-4 px-4">
            <div className="max-h-60 overflow-y-auto rounded-lg border border-gray-200 dark:border-gray-700 min-w-full">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gradient-to-r from-cgpa-blue/10 to-transparent dark:from-cgpa-blue/20 dark:to-transparent sticky top-0">
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
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                  {semesters.map((semester, index) => (
                    <tr key={semester.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="px-4 py-2 text-sm">{semester.name}</td>
                      <td className="px-4 py-2 text-sm">{semester.tnu}</td>
                      <td className="px-4 py-2 text-sm">{semester.tcp}</td>
                      <td className="px-4 py-2 text-sm font-medium text-cgpa-blue">{semester.gpa.toFixed(2)}</td>
                      <td className="px-4 py-2 text-sm font-medium text-cgpa-gold">
                        {semester.cgpa?.toFixed(2) || "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {semesters.map((semester, semIndex) => (
        <Card
          key={semester.id}
          className="mb-6 border-cgpa-blue/20 hover:shadow-md transition-all duration-300 overflow-hidden"
        >
          <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-2 bg-gradient-to-r from-cgpa-blue/10 to-transparent">
            <CardTitle className="text-lg text-cgpa-blue mb-2 sm:mb-0">
              <Input
                value={semester.name}
                onChange={(e) => updateSemesterField(semIndex, "name", e.target.value)}
                className="max-w-[200px] border-cgpa-blue/20 focus:border-cgpa-blue focus:ring-cgpa-blue transition-all duration-300"
              />
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeSemester(semester.id)}
              disabled={semesters.length === 1}
              className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-300 self-end sm:self-auto"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`tnu-${semIndex}`} className="text-cgpa-blue">
                  Total Number of Units (TNU)
                </Label>
                <Input
                  id={`tnu-${semIndex}`}
                  type="number"
                  value={semester.tnu || ""}
                  onChange={(e) => updateSemesterField(semIndex, "tnu", e.target.value)}
                  min="0"
                  step="1"
                  className="border-cgpa-blue/20 focus:border-cgpa-blue focus:ring-cgpa-blue transition-all duration-300"
                />
              </div>
              <div>
                <Label htmlFor={`tcp-${semIndex}`} className="text-cgpa-gold">
                  Total Credit Points (TCP)
                </Label>
                <Input
                  id={`tcp-${semIndex}`}
                  type="number"
                  value={semester.tcp || ""}
                  onChange={(e) => updateSemesterField(semIndex, "tcp", e.target.value)}
                  min="0"
                  step="0.01"
                  className="border-cgpa-gold/20 focus:border-cgpa-gold focus:ring-cgpa-gold transition-all duration-300"
                />
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-cgpa-blue/10 to-cgpa-blue/5 dark:from-cgpa-blue/20 dark:to-cgpa-blue/10 p-3 rounded-md hover:shadow-sm transition-all duration-300">
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">GPA</div>
                <div className="text-xl font-bold text-cgpa-blue">{semester.gpa.toFixed(2)}</div>
              </div>

              <div className="bg-gradient-to-br from-cgpa-gold/10 to-cgpa-gold/5 dark:from-cgpa-gold/20 dark:to-cgpa-gold/10 p-3 rounded-md hover:shadow-sm transition-all duration-300">
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">CGPA</div>
                <div className="text-xl font-bold text-cgpa-gold">{semester.cgpa.toFixed(2)}</div>
              </div>

              <div className="bg-gradient-to-br from-cgpa-blue/10 to-cgpa-blue/5 dark:from-cgpa-blue/20 dark:to-cgpa-blue/10 p-3 rounded-md hover:shadow-sm transition-all duration-300">
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Perfect TCP</div>
                <div className="text-xl font-bold text-cgpa-blue">{(semester.tnu * 5).toFixed(2)}</div>
                <div className="text-xs text-gray-500">(TNU × 5)</div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-cgpa-navy-light p-4 rounded-lg">
        <div className="flex items-center space-x-2 w-full sm:w-1/2">
          <Label htmlFor="save-name" className="whitespace-nowrap text-cgpa-blue">
            Save As:
          </Label>
          <Input
            id="save-name"
            value={saveName}
            onChange={(e) => setSaveName(e.target.value)}
            placeholder="Enter a name to save"
            className="border-cgpa-blue/20 focus:border-cgpa-blue focus:ring-cgpa-blue transition-all duration-300"
          />
        </div>

        <div className="flex space-x-2 w-full sm:w-auto justify-end">
          <Button
            onClick={handleSave}
            variant="outline"
            disabled={!saveName.trim()}
            className="border-cgpa-gold text-cgpa-gold hover:bg-cgpa-gold/10 transition-all duration-300"
          >
            <Save className="h-4 w-4 mr-2" /> Save
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-gradient-to-r from-cgpa-blue to-cgpa-gold text-white hover:opacity-90 transition-all duration-300"
          >
            Continue <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Dialog for selecting saved data */}
      <Dialog open={showSavedDataDialog} onOpenChange={setShowSavedDataDialog}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-cgpa-navy-light border-cgpa-blue/20">
          <DialogHeader>
            <DialogTitle className="text-gradient">Select Saved Data</DialogTitle>
          </DialogHeader>
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
                      <span className="text-cgpa-gold font-medium">{calculateCGPA(data.semesters).toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">No saved data found</div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

