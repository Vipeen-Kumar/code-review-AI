const aiService = require("../services/ai.service");

module.exports.getReview = async (req, res) => {
  try {
    // ✅ Destructure both code and language from the request body
    const { code, language } = req.body;

    // ✅ Validate both inputs
    if (!code || !language) {
      return res.status(400).send("Both 'code' and 'language' are required.");
    }

    // ✅ Pass the inputs as a single object to the service
    const response = await aiService({ code, language });

    res.send(response);

  } catch (error) {
    console.error("Error in AI controller:", error.message);
    res.status(500).send("An internal server error occurred.");
  }
};