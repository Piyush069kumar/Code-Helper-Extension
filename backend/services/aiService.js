const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Gemini client with your API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.getAIHint = async (questionText) => {
  try {
    // Use the Gemini model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); 
    
    // Send the user's question to the model
    const result = await model.generateContent({
      contents: [
        {
          parts: [{ text: questionText }]
        }
      ]
    });
    

    // Extract the AI's reply
    const aiHint = result.response.candidates[0].content.parts[0].text.trim();
    return aiHint;
  } catch (error) {
    console.error("AI API error:", error.response ? error.response.data : error.message);
    throw new Error("Failed to get AI hint");
  }
}; 