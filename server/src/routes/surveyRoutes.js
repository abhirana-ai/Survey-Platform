import express from "express";
import { createSurvey, getAllSurveys, getSurveyById, updateSurvey } from "../controllers/surveyController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createSurvey); // creating 
router.get("/", protect, getAllSurveys); // fetching
router.get("/:id", protect, getSurveyById);
router.put("/:id" , protect , updateSurvey)

export default router;