import type { SemesterData, SavedTranscriptData } from "../types"

// Save transcript data to localStorage
export function saveTranscriptData(data: SemesterData[]): void {
  try {
    localStorage.setItem("transcriptData", JSON.stringify(data))
  } catch (error) {
    console.error("Error saving transcript data:", error)
  }
}

// Load transcript data from localStorage
export function loadTranscriptData(): SemesterData[] | null {
  try {
    const data = localStorage.getItem("transcriptData")
    if (data) {
      return JSON.parse(data) as SemesterData[]
    }
    return null
  } catch (error) {
    console.error("Error loading transcript data:", error)
    return null
  }
}

// Save named transcript data to localStorage
export function saveNamedTranscriptData(name: string, data: SemesterData[]): void {
  try {
    const savedData: SavedTranscriptData = {
      name,
      date: new Date().toISOString(),
      semesters: data,
    }

    // Get existing saved data
    const existingSavedDataStr = localStorage.getItem("savedTranscriptData")
    let savedDataList: SavedTranscriptData[] = []

    if (existingSavedDataStr) {
      savedDataList = JSON.parse(existingSavedDataStr)
    }

    // Add new data
    savedDataList.push(savedData)

    // Save back to localStorage
    localStorage.setItem("savedTranscriptData", JSON.stringify(savedDataList))

    // Also update current transcript data
    saveTranscriptData(data)
  } catch (error) {
    console.error("Error saving named transcript data:", error)
  }
}

// Load saved transcript data list
export function loadSavedTranscriptDataList(): SavedTranscriptData[] {
  try {
    const data = localStorage.getItem("savedTranscriptData")
    if (data) {
      return JSON.parse(data) as SavedTranscriptData[]
    }
    return []
  } catch (error) {
    console.error("Error loading saved transcript data list:", error)
    return []
  }
}

// Check if transcript data exists in localStorage
export function hasTranscriptData(): boolean {
  return localStorage.getItem("transcriptData") !== null
}

// Clear transcript data from localStorage
export function clearTranscriptData(): void {
  localStorage.removeItem("transcriptData")
}

