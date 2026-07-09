import express from 'express';
import cors from 'cors';
import authRoutes from "./routes/authRoutes.js";
import surveyRoutes from "./routes/surveyRoutes.js";
import surveyResponseRoutes from "./routes/surveyResponseRoutes.js"

const app = express();

const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

app.use(express.json());

app.use("/api/auth", authRoutes);

app.use("/api/surveys", surveyRoutes);

app.use("/api/responses", surveyResponseRoutes);

// health route
app.get('/api/health', (request, response) => {
  response.status(200).json({
    status: 'ok',
    message: 'Survey Platform API is running',
  });
});

export default app;
