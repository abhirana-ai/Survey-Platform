import { post } from './api.js';

export const registerUser = (payload) => post('/auth/register', payload);
export const loginUser = (payload) => post('/auth/login', payload);
