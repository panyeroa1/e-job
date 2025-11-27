import { GoogleGenAI } from '@google/genai';

const API_KEY = process.env.API_KEY || '';
const MODEL_NAME = 'gemini-1.5-flash';

export interface ExtractedResume {
  name: string;
  email: string;
  role: string;
  experience: string;
  skills: string[];
  education: string[];
  summary: string;
}

export async function extractResumeData(file: File): Promise<ExtractedResume> {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  let inlineData: { mimeType: string; data: string } | null = null;
  let textData: string | null = null;

  if (file.type === 'application/pdf' || file.type.startsWith('image/')) {
    const base64 = await fileToGenerativePart(file);
    inlineData = { mimeType: file.type, data: base64 };
  } else {
    textData = await file.text();
  }

  const prompt = `
    You are an expert HR assistant. Extract the following information from the resume:
    - Name
    - Email
    - Target Role (or current role)
    - Experience Summary (brief)
    - Key Skills (list)
    - Education (list)
    - Professional Summary (brief)

    Return the response as a valid JSON object with the following structure:
    {
      "name": "...",
      "email": "...",
      "role": "...",
      "experience": "...",
      "skills": ["..."],
      "education": ["..."],
      "summary": "..."
    }
    
    If any field is missing, use an empty string or empty list. Do not include markdown formatting like \`\`\`json.
  `;

  try {
    // Use the correct API for @google/genai (v0.2.0)
    // It seems to be client.models.generateContent or similar.
    // Based on the error, getGenerativeModel is missing.
    // Let's try the direct client method if available, or check if we need to use the 'models' namespace.
    
    // Assuming the new SDK structure:
    const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: inlineData ? [{
            role: 'user',
            parts: [
                { text: prompt },
                { inlineData: inlineData }
            ]
        }] : [{
            role: 'user',
            parts: [
                { text: prompt + "\n\nRESUME CONTENT:\n" + textData }
            ]
        }]
    });

    const responseText = response.text ? response.text.toString() : '';
    // Clean up potential markdown code blocks
    const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    
    return JSON.parse(cleanJson) as ExtractedResume;

  } catch (error) {
    console.error("Error extracting resume:", error);
    throw new Error("Failed to extract resume data.");
  }
}

async function fileToGenerativePart(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        resolve(base64String);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
