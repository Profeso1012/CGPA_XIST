import type { SemesterData } from "../types"

// API key for the LLM service
const API_KEY = "062ffb9e-342a-459d-907d-ba0001a902f7"
const API_URL = "https://api.llama-api.com/v1/chat/completions" // Replace with the actual API endpoint

interface LLMResponse {
  semesters: {
    name: string
    tnu: number
    tcp: number
    gpa: number
    cgpa?: number
    courses: {
      code: string
      title: string
      units: number
      score: number
      grade: string
      gradePoint: number
    }[]
  }[]
}

/**
 * Extracts structured transcript data from PDF text using LLM
 */
export async function extractTranscriptDataWithLLM(pdfText: string): Promise<SemesterData[]> {
  try {
    // Prepare the prompt for the LLM
    const prompt = `
      Extract academic transcript data from the following text. 
      The response should be a valid JSON object with the following structure:
      {
        "semesters": [
          {
            "name": "Semester name (e.g., 'First Semester, 100 Level (2020/2021)')",
            "tnu": Total Number of Units (number),
            "tcp": Total Credit Points (number),
            "gpa": GPA for this semester (number),
            "cgpa": Cumulative GPA up to this semester (number, optional),
            "courses": [
              {
                "code": "Course code (e.g., 'CSC101')",
                "title": "Course title",
                "units": Number of units (number),
                "score": Score (number),
                "grade": "Grade (e.g., 'A', 'B', 'C', etc.)",
                "gradePoint": Grade point (number)
              }
            ]
          }
        ]
      }
      
      Only include fields that you can confidently extract from the text. If you cannot find certain information, use reasonable defaults or omit the field.
      
      Here is the transcript text:
      ${pdfText}
    `

    // Make the API request
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3-70b-instruct", // Adjust based on available models
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that extracts structured data from academic transcripts.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.1, // Low temperature for more deterministic outputs
        max_tokens: 2000,
      }),
    })

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`)
    }

    const data = await response.json()

    // Extract the LLM's response
    const llmResponseText = data.choices[0].message.content

    // Parse the JSON from the LLM response
    // First, find the JSON object in the response (it might be surrounded by markdown code blocks)
    const jsonMatch = llmResponseText.match(/```json\s*([\s\S]*?)\s*```/) ||
      llmResponseText.match(/```\s*([\s\S]*?)\s*```/) || [null, llmResponseText]

    const jsonString = jsonMatch[1] || llmResponseText

    // Parse the JSON
    const parsedData: LLMResponse = JSON.parse(jsonString)

    // Convert to our application's format
    return parsedData.semesters.map((semester) => ({
      id: crypto.randomUUID(), // Generate a unique ID
      name: semester.name,
      courses: semester.courses || [],
      tnu: semester.tnu,
      tcp: semester.tcp,
      gpa: semester.gpa,
      cgpa: semester.cgpa,
    }))
  } catch (error) {
    console.error("Error extracting data with LLM:", error)
    throw new Error("Failed to extract transcript data using AI. Please try again or use manual input.")
  }
}

