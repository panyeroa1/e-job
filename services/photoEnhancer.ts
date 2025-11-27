// Photo enhancement service using Gemini 2.5 Flash Image
const GEMINI_API_KEY = import.meta.env.GEMINI_API_KEY || '';
const MODEL_ID = 'gemini-2.5-flash-image';

export async function enhancePhoto(base64Image: string): Promise<string> {
  try {
    const prompt = `Transform this photo into a professional studio portrait. 
    Requirements:
    - Clean, neutral background (solid color or subtle gradient)
    - Professional lighting (soft, even, flattering)
    - Sharp focus on the subject
    - Professional color grading
    - Remove any distracting elements
    - Maintain natural appearance while looking polished
    Make it look like it was taken in a professional photography studio.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_ID}:streamGenerateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: prompt
                },
                {
                  inlineData: {
                    mimeType: 'image/jpeg',
                    data: base64Image
                  }
                }
              ]
            }
          ],
          generationConfig: {
            responseModalities: ['IMAGE'],
            imageConfig: {
              aspectRatio: '1:1'
            }
          }
        })
      }
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const result = await response.json();
    
    // Extract the enhanced image from response
    if (result.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data) {
      return result.candidates[0].content.parts[0].inlineData.data;
    }
    
    // Fallback to original if enhancement fails
    return base64Image;
  } catch (error) {
    console.error('Photo enhancement error:', error);
    // Return original photo if enhancement fails
    return base64Image;
  }
}

export async function capturePhotoFromCamera(): Promise<string> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } })
      .then(stream => {
        video.srcObject = stream;
        video.play();
        
        video.onloadedmetadata = () => {
          // Wait a bit for camera to adjust
          setTimeout(() => {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(video, 0, 0);
            
            const base64 = canvas.toDataURL('image/jpeg', 0.9).split(',')[1];
            
            // Stop camera
            stream.getTracks().forEach(track => track.stop());
            
            resolve(base64);
          }, 1000);
        };
      })
      .catch(reject);
  });
}
