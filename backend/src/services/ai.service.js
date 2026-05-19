const { GoogleGenAI }= require("@google/genai");
require("dotenv").config()

const ai = new GoogleGenAI({
    apiKey:process.env.GEMINI_API_KEY
});

// async function generateResponse(prompt) {
//   const response = await ai.models.generateContent({
//     model: "gemini-2.5-flash",
//     contents: prompt,
//   });

//   return response.text
  
// }
async function generateResponse(prompt) {
  try {
    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    console.log("AI RAW:", result);

    return result.text || result.response?.text?.() || "No response";
  } catch (err) {
    console.log("🔥 GEMINI ERROR:", err.message);
    throw err;
  }
}
module.exports=generateResponse