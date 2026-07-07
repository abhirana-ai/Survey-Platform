import express from 'express';
import authRoutes from "./routes/authRoutes.js";
import surveyRoutes from "./routes/surveyRoutes.js";

const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);

app.use("/api/surveys", surveyRoutes);

// health route
app.get('/api/health', (request, response) => {
  response.status(200).json({
    status: 'ok',
    message: 'Survey Platform API is running',
  });
});

export default app;
