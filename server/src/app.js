import express from 'express';

const app = express();

app.use(express.json());

app.get('/api/health', (request, response) => {
  response.status(200).json({
    status: 'ok',
    message: 'Survey Platform API is running',
  });
});

export default app;
