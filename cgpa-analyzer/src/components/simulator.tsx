"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Trash2, Calculator, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import type { SemesterData, SimulationResult, SimulationScenario } from "../types"
import { v4 as uuidv4 } from "uuid"
import { motion } from "framer-motion"

interface SimulatorProps {
  existingSemesters: SemesterData[]
  onSimulationComplete: (results: SimulationResult) => void
}

export default function Simulator({ existingSemesters, onSimulationComplete }: SimulatorProps) {
  const [futureSemesters, setFutureSemesters] = useState<SemesterData[]>([
    {
      id: uuidv4(),
      name: `Semester ${existingSemesters.length + 1}`,
      courses: [],
      tnu: 0,
      tcp: 0,
      gpa: 0,
    },
  ])

  const [targetCGPA, setTargetCGPA] = useState<number>(4.5)
  const [simulationMode, setSimulationMode] = useState<"course" | "semester">("semester")
  const [semesterTNUErrors, setSemesterTNUErrors] = useState<Record<string, string>>({})

  // Calculate current CGPA from existing semesters
  const currentTotalTNU = existingSemesters.reduce((sum, sem) => sum + sem.tnu, 0)
  const currentTotalTCP = existingSemesters.reduce((sum, sem) => sum + sem.tcp, 0)
  const currentCGPA = currentTotalTNU > 0 ? currentTotalTCP / currentTotalTNU : 0

  const addFutureSemester = () => {
    setFutureSemesters([
      ...futureSemesters,
      {
        id: uuidv4(),
        name: `Semester ${existingSemesters.length + futureSemesters.length + 1}`,
        courses: [],
        tnu: 0,
        tcp: 0,
        gpa: 0,
      },
    ])
  }

  const removeFutureSemester = (id: string) => {
    setFutureSemesters(futureSemesters.filter((sem) => sem.id !== id))
    // Clear any errors for this semester
    setSemesterTNUErrors((prev) => {
      const newErrors = { ...prev }
      delete newErrors[id]
      return newErrors
    })
  }

  const updateSemesterTNU = (index: number, value: number) => {
    const updated = [...futureSemesters]
    updated[index].tnu = value
    setFutureSemesters(updated)

    // Check if there are courses and validate their total units
    const semesterId = updated[index].id
    validateCourseTNU(semesterId, updated[index].courses, value)
  }

  const updateSemesterTCP = (index: number, value: number) => {
    const updated = [...futureSemesters]
    updated[index].tcp = value
    // Calculate GPA
    updated[index].gpa = updated[index].tnu > 0 ? value / updated[index].tnu : 0
    setFutureSemesters(updated)
  }

  const addCourse = (semesterId: string) => {
    setFutureSemesters(
      futureSemesters.map((sem) => {
        if (sem.id === semesterId) {
          const updatedCourses = [
            ...sem.courses,
            {
              code: "",
              title: "",
              units: 3,
              score: 0,
              grade: "",
              gradePoint: 0,
            },
          ]

          // Validate the total units of courses against semester TNU
          validateCourseTNU(semesterId, updatedCourses, sem.tnu)

          return {
            ...sem,
            courses: updatedCourses,
          }
        }
        return sem
      }),
    )
  }

  const removeCourse = (semesterId: string, index: number) => {
    setFutureSemesters(
      futureSemesters.map((sem) => {
        if (sem.id === semesterId) {
          const updatedCourses = [...sem.courses]
          updatedCourses.splice(index, 1)

          // Validate the total units of courses against semester TNU
          validateCourseTNU(semesterId, updatedCourses, sem.tnu)

          return {
            ...sem,
            courses: updatedCourses,
          }
        }
        return sem
      }),
    )
  }

  const updateCourse = (semesterId: string, index: number, field: string, value: any) => {
    setFutureSemesters(
      futureSemesters.map((sem) => {
        if (sem.id === semesterId) {
          const updatedCourses = [...sem.courses]
          updatedCourses[index] = {
            ...updatedCourses[index],
            [field]: value,
          }

          // If updating grade point, recalculate grade
          if (field === "gradePoint") {
            const gradePoint = Number(value)
            let grade = ""

            if (gradePoint >= 4.5) grade = "A"
            else if (gradePoint >= 3.5) grade = "B"
            else if (gradePoint >= 2.5) grade = "C"
            else if (gradePoint >= 1.5) grade = "D"
            else if (gradePoint >= 0.5) grade = "E"
            else grade = "F"

            updatedCourses[index].grade = grade

            // Auto-calculate credit points (units * gradePoint)
            if (updatedCourses[index].units) {
              const creditPoints = updatedCourses[index].units * gradePoint
              updatedCourses[index].score = creditPoints
            }
          }

          // If updating units, validate the total units and recalculate credit points
          if (field === "units") {
            validateCourseTNU(semesterId, updatedCourses, sem.tnu)

            // Auto-calculate credit points (units * gradePoint)
            if (updatedCourses[index].gradePoint) {
              const creditPoints = value * updatedCourses[index].gradePoint
              updatedCourses[index].score = creditPoints
            }
          }

          return {
            ...sem,
            courses: updatedCourses,
          }
        }
        return sem
      }),
    )
  }

  // Change the validateCourseTNU function to use warnings instead of errors
  const validateCourseTNU = (semesterId: string, courses: any[], semesterTNU: number) => {
    if (courses.length === 0 || semesterTNU === 0) {
      // Clear any existing warning for this semester
      setSemesterTNUErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[semesterId]
        return newErrors
      })
      return
    }

    const totalCourseUnits = courses.reduce((sum, course) => sum + Number(course.units), 0)

    if (totalCourseUnits > semesterTNU) {
      setSemesterTNUErrors((prev) => ({
        ...prev,
        [semesterId]: `Total course units (${totalCourseUnits}) exceed semester TNU (${semesterTNU})`,
      }))
    } else if (totalCourseUnits < semesterTNU) {
      setSemesterTNUErrors((prev) => ({
        ...prev,
        [semesterId]: `Total course units (${totalCourseUnits}) are less than semester TNU (${semesterTNU})`,
      }))
    } else {
      // Units match, clear any warning
      setSemesterTNUErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[semesterId]
        return newErrors
      })
    }
  }

  const calculateSemesterStats = () => {
    return futureSemesters.map((sem) => {
      if (simulationMode === "course" && sem.courses.length > 0) {
        const totalCourseUnits = sem.courses.reduce((sum, course) => sum + Number(course.units), 0)
        const totalCoursePoints = sem.courses.reduce(
          (sum, course) => sum + Number(course.units) * Number(course.gradePoint),
          0,
        )

        // Calculate the perfect TCP (TNU * 5)
        const perfectTCP = sem.tnu * 5

        // Calculate remaining units (TNU - total course units)
        const remainingUnits = sem.tnu - totalCourseUnits

        // Calculate remaining TCP assuming 5.0 for all remaining courses
        const remainingTCP = remainingUnits * 5

        // Calculate total TCP (course TCP + remaining TCP)
        const totalTCP = totalCoursePoints + remainingTCP

        // Calculate GPA
        const gpa = sem.tnu > 0 ? totalTCP / sem.tnu : 0

        return {
          ...sem,
          tnu: sem.tnu,
          tcp: totalTCP,
          gpa,
          courseStats: {
            enteredUnits: totalCourseUnits,
            enteredTCP: totalCoursePoints,
            remainingUnits,
            remainingTCP,
            perfectTCP,
          },
        }
      }
      return sem
    })
  }

  const runSimulation = () => {
    const calculatedFutureSemesters = calculateSemesterStats()

    // Calculate future total TNU and TCP
    const futureTotalTNU = calculatedFutureSemesters.reduce((sum, sem) => sum + sem.tnu, 0)
    const futureTotalTCP = calculatedFutureSemesters.reduce((sum, sem) => sum + sem.tcp, 0)

    // Calculate combined totals
    const combinedTotalTNU = currentTotalTNU + futureTotalTNU
    const combinedTotalTCP = currentTotalTCP + futureTotalTCP

    // Calculate final CGPA
    const finalCGPA = combinedTotalTNU > 0 ? combinedTotalTCP / combinedTotalTNU : 0

    // Calculate minimum required GPA for target CGPA
    const requiredTCP = targetCGPA * combinedTotalTNU
    const additionalTCPNeeded = requiredTCP - currentTotalTCP
    const minimumRequiredGPA = futureTotalTNU > 0 ? additionalTCPNeeded / futureTotalTNU : 0

    // Create simulation scenarios
    const scenarios: SimulationScenario[] = [
      {
        name: "Current Projection",
        futureSemesters: calculatedFutureSemesters,
        targetCGPA,
        finalCGPA,
        isAchievable: finalCGPA >= targetCGPA,
        minimumRequiredGPA,
      },
      {
        name: "Best Case Scenario",
        futureSemesters: calculatedFutureSemesters.map((sem) => ({
          ...sem,
          gpa: 5.0,
          tcp: sem.tnu * 5.0,
        })),
        targetCGPA,
        finalCGPA: (currentTotalTCP + futureTotalTNU * 5.0) / combinedTotalTNU,
        isAchievable: true,
        minimumRequiredGPA,
      },
      {
        name: "Minimum Required",
        futureSemesters: calculatedFutureSemesters.map((sem) => ({
          ...sem,
          gpa: Math.min(5.0, Math.max(0, minimumRequiredGPA)),
          tcp: sem.tnu * Math.min(5.0, Math.max(0, minimumRequiredGPA)),
        })),
        targetCGPA,
        finalCGPA: targetCGPA,
        isAchievable: minimumRequiredGPA <= 5.0,
        minimumRequiredGPA,
      },
    ]

    // Prepare and return simulation results
    const simulationResult: SimulationResult = {
      currentCGPA,
      currentTotalTCP,
      currentTotalTNU,
      scenarios,
    }

    onSimulationComplete(simulationResult)
  }

  return (
    <div className="space-y-6">
      <motion.div
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h2 className="text-xl font-bold text-gradient">CGPA Simulator</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Current CGPA: <span className="font-medium text-cgpa-gold">{currentCGPA.toFixed(2)}</span> (TCP:{" "}
            <span className="font-medium">{currentTotalTCP.toFixed(2)}</span>, TNU:{" "}
            <span className="font-medium">{currentTotalTNU}</span>)
          </p>
        </div>
        <div className="flex items-center space-x-4 w-full sm:w-auto">
          <div>
            <Label htmlFor="targetCGPA" className="text-cgpa-blue">
              Target CGPA
            </Label>
            <Input
              id="targetCGPA"
              type="number"
              value={targetCGPA}
              onChange={(e) => setTargetCGPA(Number(e.target.value))}
              min="0"
              max="5"
              step="0.1"
              className="w-24 border-cgpa-blue/30 focus:border-cgpa-blue focus:ring-cgpa-blue"
            />
          </div>
          <Button
            onClick={addFutureSemester}
            variant="outline"
            size="sm"
            className="border-cgpa-blue text-cgpa-blue hover:bg-cgpa-blue/10"
          >
            <Plus className="h-4 w-4 mr-2" /> Add Semester
          </Button>
        </div>
      </motion.div>

      <Tabs
        value={simulationMode}
        onValueChange={(value) => setSimulationMode(value as "course" | "semester")}
        className="mt-6"
      >
        <TabsList className="mb-4 bg-gray-100 dark:bg-gray-800 w-full flex">
          <TabsTrigger
            value="semester"
            className="flex-1 data-[state=active]:bg-cgpa-blue data-[state=active]:text-white"
          >
            Semester-based
          </TabsTrigger>
          <TabsTrigger
            value="course"
            className="flex-1 data-[state=active]:bg-cgpa-blue data-[state=active]:text-white"
          >
            Course-based
          </TabsTrigger>
        </TabsList>

        <TabsContent value="semester">
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Mobile-optimized semester inputs */}
            {futureSemesters.map((semester, index) => (
              <motion.div
                key={semester.id}
                className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                {/* Semester name on top */}
                <div className="mb-3">
                  <Input
                    value={semester.name}
                    onChange={(e) => {
                      const updated = [...futureSemesters]
                      updated[index].name = e.target.value
                      setFutureSemesters(updated)
                    }}
                    className="border-cgpa-blue/20 focus:border-cgpa-blue focus:ring-cgpa-blue text-lg font-medium"
                  />
                </div>

                {/* TNU, TCP, GPA in a grid below */}
                <div className="grid grid-cols-3 gap-2 mb-2">
                  <div>
                    <Label className="text-xs text-gray-500">TNU</Label>
                    <Input
                      type="number"
                      value={semester.tnu || ""}
                      onChange={(e) => updateSemesterTNU(index, Number(e.target.value))}
                      min="0"
                      className="border-cgpa-blue/20 focus:border-cgpa-blue focus:ring-cgpa-blue"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">TCP</Label>
                    <Input
                      type="number"
                      value={semester.tcp || ""}
                      onChange={(e) => updateSemesterTCP(index, Number(e.target.value))}
                      min="0"
                      className="border-cgpa-blue/20 focus:border-cgpa-blue focus:ring-cgpa-blue"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">GPA</Label>
                    <Input
                      value={semester.tnu > 0 ? (semester.tcp / semester.tnu).toFixed(2) : "0.00"}
                      readOnly
                      className="bg-gray-50 dark:bg-gray-800 text-cgpa-gold font-medium"
                    />
                  </div>
                </div>

                {/* Delete button */}
                <div className="flex justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFutureSemester(semester.id)}
                    disabled={futureSemesters.length === 1}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="h-4 w-4 mr-1" /> Remove
                  </Button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </TabsContent>

        <TabsContent value="course">
          {futureSemesters.map((semester, semIndex) => (
            <motion.div
              key={semester.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: semIndex * 0.1 }}
            >
              <Card className="mb-6 border-cgpa-blue/20 overflow-hidden">
                <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-2 bg-gradient-to-r from-cgpa-blue/10 to-transparent">
                  <CardTitle className="text-lg text-cgpa-blue mb-2 sm:mb-0">
                    <Input
                      value={semester.name}
                      onChange={(e) => {
                        const updated = [...futureSemesters]
                        updated[semIndex].name = e.target.value
                        setFutureSemesters(updated)
                      }}
                      className="max-w-[200px] border-cgpa-blue/20 focus:border-cgpa-blue focus:ring-cgpa-blue"
                    />
                  </CardTitle>
                  <div className="flex items-center space-x-4">
                    <div>
                      <Label htmlFor={`tnu-${semIndex}`} className="text-xs text-gray-500">
                        TNU
                      </Label>
                      <Input
                        id={`tnu-${semIndex}`}
                        type="number"
                        value={semester.tnu || ""}
                        onChange={(e) => updateSemesterTNU(semIndex, Number(e.target.value))}
                        min="0"
                        className="w-20 border-cgpa-blue/20 focus:border-cgpa-blue focus:ring-cgpa-blue"
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFutureSemester(semester.id)}
                      disabled={futureSemesters.length === 1}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {semesterTNUErrors[semester.id] && (
                    <Alert
                      variant="warning"
                      className="mb-4 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800"
                    >
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Warning</AlertTitle>
                      <AlertDescription>{semesterTNUErrors[semester.id]}</AlertDescription>
                    </Alert>
                  )}

                  {semester.courses.length > 0 ? (
                    <div className="space-y-4">
                      {/* Mobile-optimized course inputs - 2 rows instead of 4 columns */}
                      <div className="grid grid-cols-2 gap-2 font-medium text-sm bg-gray-50 dark:bg-gray-800 p-2 rounded-lg">
                        <div className="col-span-1">Code/Units</div>
                        <div className="col-span-1">Grade/Credit</div>
                      </div>

                      {semester.courses.map((course, courseIndex) => (
                        <div
                          key={courseIndex}
                          className="relative border border-gray-200 dark:border-gray-700 rounded-lg p-2"
                        >
                          <div className="grid grid-cols-2 gap-2">
                            {/* First row: Code and Units */}
                            <div className="col-span-1 space-y-1">
                              <Label className="text-xs">Code</Label>
                              <Input
                                value={course.code}
                                onChange={(e) => updateCourse(semester.id, courseIndex, "code", e.target.value)}
                                placeholder="e.g. CSC101"
                                className="border-cgpa-blue/20 focus:border-cgpa-blue focus:ring-cgpa-blue text-sm"
                              />
                            </div>
                            <div className="col-span-1 space-y-1">
                              <Label className="text-xs">Grade</Label>
                              <select
                                value={course.gradePoint || ""}
                                onChange={(e) => {
                                  const gradePoint = Number(e.target.value)
                                  updateCourse(semester.id, courseIndex, "gradePoint", gradePoint)
                                }}
                                className="w-full rounded-md border border-cgpa-blue/20 focus:border-cgpa-blue focus:ring-cgpa-blue py-1 px-2 text-sm"
                              >
                                <option value="">Pick</option>
                                <option value="5.0">A (5.0)</option>
                                <option value="4.0">B (4.0)</option>
                                <option value="3.0">C (3.0)</option>
                                <option value="2.0">D (2.0)</option>
                                <option value="1.0">E (1.0)</option>
                                <option value="0.0">F (0.0)</option>
                              </select>
                            </div>

                            {/* Second row: Units and Credit */}
                            <div className="col-span-1 space-y-1">
                              <Label className="text-xs">Units</Label>
                              <Input
                                type="number"
                                value={course.units || ""}
                                onChange={(e) =>
                                  updateCourse(semester.id, courseIndex, "units", Number(e.target.value))
                                }
                                min="0"
                                max="6"
                                className="border-cgpa-blue/20 focus:border-cgpa-blue focus:ring-cgpa-blue text-sm"
                              />
                            </div>
                            <div className="col-span-1 space-y-1">
                              <div className="flex items-center justify-between">
                                <Label className="text-xs">Credit</Label>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeCourse(semester.id, courseIndex)}
                                  className="text-red-500 hover:text-red-700 p-0 h-5 w-5"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                              <Input
                                value={(course.units * course.gradePoint).toFixed(2)}
                                readOnly
                                className="bg-gray-50 dark:bg-gray-800 font-medium text-cgpa-gold text-sm"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <p>No courses added yet. Add a course to get started.</p>
                      <p className="text-sm mt-2">Set the semester TNU first to ensure accurate calculations.</p>
                    </div>
                  )}

                  <div className="mt-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addCourse(semester.id)}
                      className="border-cgpa-blue text-cgpa-blue hover:bg-cgpa-blue/10"
                      disabled={!semester.tnu}
                    >
                      <Plus className="h-4 w-4 mr-2" /> Add Course
                    </Button>

                    <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg space-y-2 w-full md:w-auto">
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                        <div className="font-medium text-gray-600 dark:text-gray-300">Entered Units:</div>
                        <div className="text-right">
                          {semester.courses.reduce((sum, course) => sum + Number(course.units), 0)}
                          {semester.tnu > 0 && <span className="text-gray-500 text-xs ml-1">of {semester.tnu}</span>}
                        </div>

                        <div className="font-medium text-gray-600 dark:text-gray-300">Entered TCP:</div>
                        <div className="text-right">
                          {semester.courses
                            .reduce((sum, course) => sum + Number(course.units) * Number(course.gradePoint), 0)
                            .toFixed(2)}
                        </div>

                        <div className="font-medium text-gray-600 dark:text-gray-300">Perfect TCP:</div>
                        <div className="text-right text-cgpa-gold font-medium">{(semester.tnu * 5).toFixed(2)}</div>

                        <div className="font-medium text-gray-600 dark:text-gray-300">Projected GPA:</div>
                        <div className="text-right text-cgpa-blue font-medium">
                          {(() => {
                            const totalCourseUnits = semester.courses.reduce(
                              (sum, course) => sum + Number(course.units),
                              0,
                            )
                            const totalCoursePoints = semester.courses.reduce(
                              (sum, course) => sum + Number(course.units) * Number(course.gradePoint),
                              0,
                            )

                            // Calculate remaining units
                            const remainingUnits = Math.max(0, semester.tnu - totalCourseUnits)

                            // Calculate total TCP (course TCP + remaining TCP with 5.0 grade point)
                            const totalTCP = totalCoursePoints + remainingUnits * 5

                            return semester.tnu > 0 ? (totalTCP / semester.tnu).toFixed(2) : "0.00"
                          })()}
                        </div>
                      </div>

                      {semester.tnu > 0 && semester.courses.length > 0 && (
                        <div className="text-xs text-gray-500 mt-2 border-t pt-2">
                          This projection assumes you'll get a 5.0 grade point in all remaining courses.
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button
          onClick={runSimulation}
          className="bg-gradient-to-r from-cgpa-blue to-cgpa-gold text-white hover:opacity-90 animate-pulse-light"
        >
          <Calculator className="h-4 w-4 mr-2" /> Run Simulation
        </Button>
      </div>
    </div>
  )
}

