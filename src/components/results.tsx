"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { SemesterData, SimulationResult } from "../types"
import { Download, Printer } from "lucide-react"
import { generatePDF } from "../utils/pdf-generator"
import { motion } from "framer-motion"

interface ResultsProps {
  results: SimulationResult
  semesters: SemesterData[]
}

export default function Results({ results, semesters }: ResultsProps) {
  const [activeScenario, setActiveScenario] = useState(results.scenarios[0].name)

  const handleGeneratePDF = async () => {
    const activeScenarioData = results.scenarios.find((s) => s.name === activeScenario)
    if (!activeScenarioData) return

    await generatePDF({
      studentInfo: {
        name: "Student Name",
        id: "Student ID",
        program: "Program",
      },
      semesters,
      simulationResults: {
        ...results,
        scenarios: [activeScenarioData],
      },
    })
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="border-cgpa-blue/20 shadow-lg overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-cgpa-blue/10 to-transparent">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle className="text-gradient">Simulation Results</CardTitle>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleGeneratePDF}
                className="border-cgpa-blue text-cgpa-blue hover:bg-cgpa-blue/10"
              >
                <Download className="h-4 w-4 mr-2" /> Export PDF
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.print()}
                className="border-cgpa-gold text-cgpa-gold hover:bg-cgpa-gold/10"
              >
                <Printer className="h-4 w-4 mr-2" /> Print
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Card className="border-cgpa-blue/20 bg-gradient-to-br from-cgpa-blue/10 to-transparent">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Current CGPA</div>
                      <div className="text-3xl font-bold mt-1 text-cgpa-blue">{results.currentCGPA.toFixed(2)}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        TCP: {results.currentTotalTCP.toFixed(2)} | TNU: {results.currentTotalTNU}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card className="border-cgpa-gold/20 bg-gradient-to-br from-cgpa-gold/10 to-transparent">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Target CGPA</div>
                      <div className="text-3xl font-bold mt-1 text-cgpa-gold">
                        {results.scenarios[0].targetCGPA.toFixed(2)}
                      </div>
                      <div className="text-xs mt-1">
                        {results.scenarios[0].isAchievable ? (
                          <span className="text-green-500 font-medium">Achievable</span>
                        ) : (
                          <span className="text-red-500 font-medium">Not achievable</span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Card className="border-cgpa-blue/20 bg-gradient-to-br from-cgpa-blue/10 to-transparent">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Minimum Required GPA</div>
                      <div className="text-3xl font-bold mt-1 text-cgpa-blue">
                        {results.scenarios[0].minimumRequiredGPA > 5
                          ? "N/A"
                          : results.scenarios[0].minimumRequiredGPA.toFixed(2)}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">For remaining semesters</div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            <div className="overflow-x-auto -mx-4 px-4">
              <Tabs value={activeScenario} onValueChange={setActiveScenario} className="w-full">
                <div className="overflow-x-auto pb-2">
                  <TabsList className="mb-4 bg-gray-100 dark:bg-gray-800 inline-flex whitespace-nowrap w-auto min-w-full">
                    {results.scenarios.map((scenario) => (
                      <TabsTrigger
                        key={scenario.name}
                        value={scenario.name}
                        className="data-[state=active]:bg-cgpa-blue data-[state=active]:text-white px-6"
                      >
                        {scenario.name}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>

                {results.scenarios.map((scenario) => (
                  <TabsContent key={scenario.name} value={scenario.name}>
                    <Card className="border-cgpa-blue/20">
                      <CardContent className="pt-6">
                        <div className="space-y-4">
                          <div className="flex flex-col sm:flex-row justify-between gap-4">
                            <div>
                              <div className="text-sm font-medium text-gray-500">Projected Final CGPA</div>
                              <div className="text-2xl font-bold text-gradient">{scenario.finalCGPA.toFixed(2)}</div>
                            </div>
                            <div className="text-left sm:text-right">
                              <div className="text-sm font-medium text-gray-500">Status</div>
                              <div
                                className={`text-lg font-semibold ${scenario.isAchievable ? "text-green-500" : "text-red-500"}`}
                              >
                                {scenario.isAchievable ? "Target Achievable" : "Target Not Achievable"}
                              </div>
                            </div>
                          </div>

                          <div className="border-t pt-4">
                            <div className="text-sm font-medium mb-2 text-cgpa-blue">Semester Breakdown</div>
                            <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                              {scenario.futureSemesters.map((sem, index) => (
                                <motion.div
                                  key={index}
                                  className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.3, delay: index * 0.05 }}
                                >
                                  <div className="font-medium mb-2 sm:mb-0">{sem.name}</div>
                                  <div className="flex flex-wrap gap-2 sm:gap-4 text-sm">
                                    <div>
                                      <span className="text-xs text-gray-500">TNU:</span> {sem.tnu}
                                    </div>
                                    <div>
                                      <span className="text-xs text-gray-500">TCP:</span>{" "}
                                      <span className="text-cgpa-blue">{sem.tcp.toFixed(2)}</span>
                                    </div>
                                    <div>
                                      <span className="text-xs text-gray-500">GPA:</span>{" "}
                                      <span className="text-cgpa-gold font-medium">{sem.gpa.toFixed(2)}</span>
                                    </div>
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          </div>

                          <div className="border-t pt-4">
                            <div className="text-sm font-medium mb-2 text-cgpa-blue">Recommendations</div>
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                              <ul className="list-disc list-inside space-y-3 text-sm">
                                {scenario.isAchievable ? (
                                  <>
                                    <li>
                                      You need to maintain a minimum GPA of{" "}
                                      <span className="font-medium text-cgpa-gold">
                                        {scenario.minimumRequiredGPA.toFixed(2)}
                                      </span>{" "}
                                      for the remaining semesters.
                                    </li>

                                    {/* Course-specific recommendations */}
                                    {scenario.futureSemesters.some((sem) => sem.courses && sem.courses.length > 0) && (
                                      <>
                                        <li className="mt-2 font-medium">Course-specific recommendations:</li>
                                        {scenario.futureSemesters.flatMap((sem, semIndex) =>
                                          sem.courses && sem.courses.length > 0
                                            ? sem.courses
                                                .map((course, courseIndex) => {
                                                  if (!course.code) return null

                                                  const creditPoint = course.units * course.gradePoint
                                                  const maxPossible = course.units * 5
                                                  const efficiency = (creditPoint / maxPossible) * 100

                                                  let recommendation = ""
                                                  if (efficiency < 60) {
                                                    recommendation = `Consider improving your performance in ${course.code} or replacing it with a course where you can perform better.`
                                                  } else if (efficiency < 80) {
                                                    recommendation = `${course.code} is performing well, but with a bit more effort you could improve your grade point.`
                                                  } else {
                                                    recommendation = `You're doing great in ${course.code}! Keep up the good work.`
                                                  }

                                                  return (
                                                    <li key={`${semIndex}-${courseIndex}`} className="ml-4 text-xs">
                                                      <span className="font-medium">{course.code}</span>:{" "}
                                                      {recommendation}
                                                    </li>
                                                  )
                                                })
                                                .filter(Boolean)
                                            : [],
                                        )}
                                      </>
                                    )}

                                    <li className="mt-2">
                                      Focus on courses with higher credit units to maximize your TCP.
                                    </li>
                                    <li>Consider retaking courses with low grades if your institution allows it.</li>
                                  </>
                                ) : (
                                  <>
                                    <li>
                                      Your target CGPA of{" "}
                                      <span className="font-medium text-cgpa-gold">
                                        {scenario.targetCGPA.toFixed(2)}
                                      </span>{" "}
                                      is not achievable with the current plan.
                                    </li>

                                    {/* Course-specific recommendations for unachievable target */}
                                    {scenario.futureSemesters.some((sem) => sem.courses && sem.courses.length > 0) && (
                                      <>
                                        <li className="mt-2 font-medium">Course-specific analysis:</li>
                                        {scenario.futureSemesters.flatMap((sem, semIndex) =>
                                          sem.courses && sem.courses.length > 0
                                            ? sem.courses
                                                .map((course, courseIndex) => {
                                                  if (!course.code) return null

                                                  const creditPoint = course.units * course.gradePoint
                                                  const maxPossible = course.units * 5
                                                  const potentialGain = maxPossible - creditPoint

                                                  return (
                                                    <li key={`${semIndex}-${courseIndex}`} className="ml-4 text-xs">
                                                      <span className="font-medium">{course.code}</span>:
                                                      {course.gradePoint < 5
                                                        ? ` Improving to a 5.0 grade point would add ${potentialGain.toFixed(2)} more credit points.`
                                                        : ` Already at maximum grade point.`}
                                                    </li>
                                                  )
                                                })
                                                .filter(Boolean)
                                            : [],
                                        )}
                                      </>
                                    )}

                                    <li className="mt-2">Consider extending your study period if possible.</li>
                                    <li>Focus on achieving the highest possible grades in all remaining courses.</li>
                                    <li>Consult with your academic advisor for additional options.</li>
                                  </>
                                )}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

