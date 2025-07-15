
const { getAIHint } = require("../services/aiService");
const Question = require("../models/Question");

exports.askQuestion = async (req, res) => {
  try {
    const { questionText } = req.body;
    const { langElem } = req.body;
    const userId = req.user.id; 

    if (!questionText) {
      return res.status(400).json({ success: false, message: "Question text is required" });
    }

    //prompt the ai to generate a hint for the question
    const prompt = `
    You are an expert ${langElem} coding assistant.
    Given the following question, provide:
    1. A step-by-step hint or breakdown of how to solve it.
    2. A brief explanation of the approach.
    3. And write the clean code with comments in ${langElem}

    Question: ${questionText}
    Language: ${langElem}
    `;
    // Get AI-generated hint, always append ' c++' to the question
    const aiHint = await getAIHint(prompt);

    // Save question and hint to DB
    const question = await Question.create({
      user: userId,
      questionText,
      aiHint
    });

    res.status(200).json({
      success: true,
      message: "AI hint generated successfully",
      data: { question }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};