import express from "express";
import { submitResponse, getSurveyResponses, getMyResponses } from "../controllers/surveyResponseController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, submitResponse);
router.get("/my-responses", protect, getMyResponses);
router.get("/survey/:surveyId", protect, getSurveyResponses);


export default router;