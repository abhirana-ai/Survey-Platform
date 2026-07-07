import Response from "../models/response.js";
import Survey from "../models/survey.js";
import isValidObjectId from "../utils/validateObjectId.js";
const submitResponse = async (req, res) => {
  try {
    const { survey, answers } = req.body;

    if (!survey || !Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Survey ID and answers are required.",
      });
    }

    if (!isValidObjectId(survey)) {
      return res.status(400).json({
        success: false,
        message: "Invalid survey ID.",
      });
    }

    const existingSurvey = await Survey.findById(survey);

    if (!existingSurvey) {
      return res.status(404).json({
        success: false,
        message: "Survey not found.",
      });
    }

    const existingResponse = await Response.findOne({
      survey,
      respondent: req.user.id,
    });

    if (existingResponse) {
      return res.status(409).json({
        success: false,
        message: "You have already submitted a response to this survey.",
      });
    }

    const response = await Response.create({
      survey,
      respondent: req.user.id,
      answers,
    });

    res.status(201).json({
      success: true,
      message: "Response submitted successfully.",
      response,
    });
  } catch (error) {
    console.error("Submit Response Error:", error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

const getSurveyResponses = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.surveyId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid survey ID.",
      });
    }
    const survey = await Survey.findById(req.params.surveyId);

    if (!survey) {
      return res.status(404).json({
        success: false,
        message: "Survey not found.",
      });
    }

    if (survey.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not authorised to view these responses.",
      });
    }

    const responses = await Response.find({
      survey: req.params.surveyId,
    });

    res.status(200).json({
      success: true,
      count: responses.length,
      responses,
    });
  } catch (error) {
    console.error("Get Survey Responses Error:", error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

const getMyResponses = async (req, res) => {
  try {
    const responses = await Response.find({
      respondent: req.user.id,
    });

    res.status(200).json({
      success: true,
      count: responses.length,
      responses,
    });
  } catch (error) {
    console.error("Get My Responses Error:", error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

export { submitResponse, getSurveyResponses, getMyResponses };
