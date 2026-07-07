import { get, post } from './api.js';

export const submitResponse = (payload) => post('/responses', payload);
export const getMyResponses = () => get('/responses/my-responses');
export const getSurveyResponses = (surveyId) => get(`/responses/survey/${surveyId}`);
