import { del, get, post, put } from './api.js';

export const createSurvey = (payload) => post('/surveys', payload);
export const getSurveys = () => get('/surveys');
export const getSurveyById = (id) => get(`/surveys/${id}`);
export const updateSurvey = (id, payload) => put(`/surveys/${id}`, payload);
export const deleteSurvey = (id) => del(`/surveys/${id}`);
