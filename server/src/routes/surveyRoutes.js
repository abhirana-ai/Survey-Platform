import express from "express";
import { createSurvey } from "../controllers/surveyController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createSurvey);

export default router;