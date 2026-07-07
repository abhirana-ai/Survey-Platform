import Survey from "../models/survey.js";

const createSurvey = async (req, res) => {
  try {
    const { title, description, questions } = req.body;

    if (!title || !questions || questions.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Title and at least one question are required.",
      });
    }

    const survey = await Survey.create({
      title,
      description,
      questions,
      createdBy: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: "Survey created successfully.",
      survey,
    });
  } catch (error) {
    console.error("Create Survey Error:", error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

export { createSurvey };