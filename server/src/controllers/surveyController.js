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

// find survey

const getAllSurveys = async (req, res) => {
  try {
    const surveys = await Survey.find();

    res.status(200).json({
      success: true,
      count: surveys.length,
      surveys,
    });
  } catch (error) {
    console.error("Get All Surveys Error:", error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};


 // get survey by id

 const getSurveyById = async (req, res) => {
  try {
    const survey = await Survey.findById(req.params.id);

    if (!survey) {
      return res.status(404).json({
        success: false,
        message: "Survey not found.",
      });
    }

    res.status(200).json({
      success: true,
      survey,
    });
  } catch (error) {
    console.error("Get Survey By ID Error:", error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

// update survey

const updateSurvey = async (req, res) => {
  try {
    const survey = await Survey.findById(req.params.id);

    if (!survey) {
      return res.status(404).json({
        success: false,
        message: "Survey not found.",
      });
    }

    if (survey.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not authorised to update this survey.",
      });
    }

    const updatedSurvey = await Survey.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Survey updated successfully.",
      survey: updatedSurvey,
    });
  } catch (error) {
    console.error("Update Survey Error:", error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

export { createSurvey, getAllSurveys, getSurveyById, updateSurvey };