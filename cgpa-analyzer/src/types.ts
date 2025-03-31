export interface Course {
  code: string
  title: string
  units: number
  score: number
  grade: string
  gradePoint: number
}

export interface SemesterData {
  id: string
  name: string
  courses: Course[]
  tnu: number // Total Number of Units
  tcp: number // Total Credit Points
  gpa: number // GPA for this semester
  cgpa?: number // CGPA up to this semester
}

export interface SimulationScenario {
  name: string
  futureSemesters: SemesterData[]
  targetCGPA: number
  finalCGPA: number
  isAchievable: boolean
  minimumRequiredGPA: number
}

export interface SimulationResult {
  currentCGPA: number
  currentTotalTCP: number
  currentTotalTNU: number
  scenarios: SimulationScenario[]
}

export interface PDFData {
  studentInfo?: {
    name: string
    id: string
    program: string
  }
  semesters: SemesterData[]
  simulationResults?: SimulationResult
}

export interface SavedTranscriptData {
  name: string
  date: string
  semesters: SemesterData[]
}

