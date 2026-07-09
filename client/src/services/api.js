import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// Flag to toggle mock data mode
let useMockMode = import.meta.env.VITE_USE_MOCK_DATA === 'true';

// Setup Axios Instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('survey_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401 and errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('survey_token');
      localStorage.removeItem('survey_user');
      window.dispatchEvent(new Event('auth:logout'));
    }
    return Promise.reject(error);
  }
);

// ----------------------------------------------------
// LOCAL STORAGE MOCK DATABASE IMPLEMENTATION
// ----------------------------------------------------

const getMockData = (key, defaultValue = []) => {
  const data = localStorage.getItem(`mock_db_${key}`);
  return data ? JSON.parse(data) : defaultValue;
};

const saveMockData = (key, data) => {
  localStorage.setItem(`mock_db_${key}`, JSON.stringify(data));
};

// Seed initial mock data if database is empty
const seedDatabase = () => {
  const surveys = getMockData('surveys');
  const users = getMockData('users');
  const responses = getMockData('responses');

  if (users.length === 0) {
    const defaultUser = {
      _id: 'usr_default123',
      name: 'Dr. Jane Smith',
      email: 'jane.smith@university.edu',
      password: 'password123',
    };
    saveMockData('users', [defaultUser]);
  }

  if (surveys.length === 0) {
    const seededSurveys = [
      {
        _id: 'srv_1',
        title: 'Academic Course Feedback',
        description: 'Collect student feedback on Computer Science 101 curriculum, pacing, and overall instruction quality.',
        createdBy: 'usr_default123',
        questions: [
          { questionText: 'What was your favorite topic in the course? [short-text]', questionType: 'text', options: [] },
          { questionText: 'How would you rate the overall pacing of the lectures? [multiple-choice]', questionType: 'multiple-choice', options: ['Too Fast', 'Just Right', 'Too Slow'] },
          { questionText: 'Which technologies did you enjoy learning the most? [checkboxes]', questionType: 'multiple-choice', options: ['React', 'Node.js', 'MongoDB', 'Tailwind CSS'] },
          { questionText: 'Please share any additional suggestions for improvements. [long-text]', questionType: 'text', options: [] },
        ],
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        _id: 'srv_2',
        title: 'SaaS Product Usability Survey',
        description: 'Provide feedback on our newly redesigned user dashboard, navigation sidebar, and general visual styling.',
        createdBy: 'usr_default123',
        questions: [
          { questionText: 'Is the dashboard loading fast enough? [multiple-choice]', questionType: 'multiple-choice', options: ['Yes, very fast', 'Acceptable speed', 'No, too slow'] },
          { questionText: 'List any UI elements that felt cluttered or hard to use. [long-text]', questionType: 'text', options: [] },
        ],
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ];
    saveMockData('surveys', seededSurveys);
  }

  if (responses.length === 0) {
    const seededResponses = [
      {
        _id: 'rsp_1',
        survey: 'srv_1',
        respondent: 'usr_respondent1',
        answers: [
          { question: 'What was your favorite topic in the course? [short-text]', answer: 'Introduction to React and State management.' },
          { question: 'How would you rate the overall pacing of the lectures? [multiple-choice]', answer: 'Just Right' },
          { question: 'Which technologies did you enjoy learning the most? [checkboxes]', answer: 'React, Node.js' },
          { question: 'Please share any additional suggestions for improvements. [long-text]', answer: 'More hands-on coding exercises during the lecture sessions would be highly beneficial.' },
        ],
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        _id: 'rsp_2',
        survey: 'srv_1',
        respondent: 'usr_respondent2',
        answers: [
          { question: 'What was your favorite topic in the course? [short-text]', answer: 'Database schema design with MongoDB.' },
          { question: 'How would you rate the overall pacing of the lectures? [multiple-choice]', answer: 'Too Fast' },
          { question: 'Which technologies did you enjoy learning the most? [checkboxes]', answer: 'MongoDB, Node.js' },
          { question: 'Please share any additional suggestions for improvements. [long-text]', answer: 'Slow down a bit on the routing sections, they were quite dense.' },
        ],
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        _id: 'rsp_3',
        survey: 'srv_2',
        respondent: 'usr_respondent1',
        answers: [
          { question: 'Is the dashboard loading fast enough? [multiple-choice]', answer: 'Yes, very fast' },
          { question: 'List any UI elements that felt cluttered or hard to use. [long-text]', answer: 'The sidebar on tablets takes up a bit too much space.' },
        ],
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ];
    saveMockData('responses', seededResponses);
  }
};

// Seed db immediately on load
seedDatabase();

// Mock Request Handler
const handleMockRequest = async (method, path, data) => {
  await new Promise((resolve) => setTimeout(resolve, 300)); // Simulate network latency

  const currentUser = JSON.parse(localStorage.getItem('survey_user') || 'null');

  // REGISTER
  if (method === 'POST' && path === '/auth/register') {
    const users = getMockData('users');
    if (users.some((u) => u.email === data.email)) {
      throw { response: { status: 400, data: { message: 'User already exists.' } } };
    }
    const newUser = {
      _id: `usr_${Date.now()}`,
      name: data.name,
      email: data.email,
      password: data.password,
    };
    users.push(newUser);
    saveMockData('users', users);
    return { success: true, message: 'User registered successfully.' };
  }

  // LOGIN
  if (method === 'POST' && path === '/auth/login') {
    const users = getMockData('users');
    const user = users.find((u) => u.email === data.email && u.password === data.password);
    if (!user) {
      throw { response: { status: 400, data: { message: 'Invalid credentials.' } } };
    }
    const token = `mock-token-${user._id}-${Date.now()}`;
    return {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    };
  }

  // ALL OTHER REQUESTS REQUIRE AUTH
  if (!localStorage.getItem('survey_token')) {
    throw { response: { status: 401, data: { message: 'Unauthorized' } } };
  }

  // SURVEYS LIST
  if (method === 'GET' && path === '/surveys') {
    const surveys = getMockData('surveys');
    return { surveys };
  }

  // CREATE SURVEY
  if (method === 'POST' && path === '/surveys') {
    const surveys = getMockData('surveys');
    const newSurvey = {
      _id: `srv_${Date.now()}`,
      title: data.title,
      description: data.description,
      questions: data.questions,
      createdBy: currentUser ? currentUser.id : 'usr_default123',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    surveys.unshift(newSurvey);
    saveMockData('surveys', surveys);
    return { success: true, message: 'Survey created.', survey: newSurvey };
  }

  // SURVEY DETAILS
  if (method === 'GET' && path.startsWith('/surveys/')) {
    const surveyId = path.split('/')[2];
    const surveys = getMockData('surveys');
    const survey = surveys.find((s) => s._id === surveyId);
    if (!survey) {
      throw { response: { status: 404, data: { message: 'Survey not found.' } } };
    }
    return { success: true, survey };
  }

  // UPDATE SURVEY
  if (method === 'PUT' && path.startsWith('/surveys/')) {
    const surveyId = path.split('/')[2];
    const surveys = getMockData('surveys');
    const index = surveys.findIndex((s) => s._id === surveyId);
    if (index === -1) {
      throw { response: { status: 404, data: { message: 'Survey not found.' } } };
    }
    
    // Auth Check
    if (surveys[index].createdBy !== currentUser?.id && surveys[index].createdBy !== 'usr_default123') {
      throw { response: { status: 403, data: { message: 'Not authorized.' } } };
    }

    const updatedSurvey = {
      ...surveys[index],
      title: data.title,
      description: data.description,
      questions: data.questions,
      updatedAt: new Date().toISOString(),
    };
    surveys[index] = updatedSurvey;
    saveMockData('surveys', surveys);
    return { success: true, survey: updatedSurvey };
  }

  // DELETE SURVEY
  if (method === 'DELETE' && path.startsWith('/surveys/')) {
    const surveyId = path.split('/')[2];
    const surveys = getMockData('surveys');
    const survey = surveys.find((s) => s._id === surveyId);
    if (!survey) {
      throw { response: { status: 404, data: { message: 'Survey not found.' } } };
    }
    if (survey.createdBy !== currentUser?.id && survey.createdBy !== 'usr_default123') {
      throw { response: { status: 403, data: { message: 'Not authorized.' } } };
    }
    const filtered = surveys.filter((s) => s._id !== surveyId);
    saveMockData('surveys', filtered);

    // Also delete associated responses
    const responses = getMockData('responses');
    const filteredResponses = responses.filter((r) => r.survey !== surveyId);
    saveMockData('responses', filteredResponses);

    return { success: true, message: 'Survey deleted successfully.' };
  }

  // SUBMIT SURVEY RESPONSE
  if (method === 'POST' && path === '/responses') {
    const responses = getMockData('responses');
    
    // Check duplication
    const duplicate = responses.find(
      (r) => r.survey === data.survey && r.respondent === currentUser?.id
    );
    if (duplicate) {
      throw { response: { status: 409, data: { message: 'You have already submitted a response.' } } };
    }

    const newResponse = {
      _id: `rsp_${Date.now()}`,
      survey: data.survey,
      respondent: currentUser ? currentUser.id : 'usr_default123',
      answers: data.answers,
      createdAt: new Date().toISOString(),
    };
    responses.push(newResponse);
    saveMockData('responses', responses);
    return { success: true, message: 'Response submitted successfully.', response: newResponse };
  }

  // MY RESPONSES
  if (method === 'GET' && path === '/responses/my-responses') {
    const responses = getMockData('responses');
    const userResponses = responses.filter(
      (r) => r.respondent === currentUser?.id || (currentUser?.id === 'usr_default123' && r.respondent === 'usr_respondent1')
    );
    return { responses: userResponses };
  }

  // RESPONSES BY SURVEY ID (for results page)
  if (method === 'GET' && path.startsWith('/responses/survey/')) {
    const surveyId = path.split('/')[3];
    const responses = getMockData('responses');
    const surveyResponses = responses.filter((r) => r.survey === surveyId);
    return { responses: surveyResponses };
  }

  throw { response: { status: 404, data: { message: 'Route not found.' } } };
};

// ----------------------------------------------------
// AXIOS / MOCK ROUTER WRAPPER
// ----------------------------------------------------

const request = async (method, path, data = null, options = {}) => {
  if (useMockMode) {
    return handleMockRequest(method, path, data);
  }

  try {
    let res;
    if (method === 'GET') {
      res = await api.get(path, options);
    } else if (method === 'POST') {
      res = await api.post(path, data, options);
    } else if (method === 'PUT') {
      res = await api.put(path, data, options);
    } else if (method === 'DELETE') {
      res = await api.delete(path, options);
    }
    return res.data;
  } catch (error) {
    // If backend connection fails, automatically toggle mock mode and print alert
    if (error.code === 'ERR_NETWORK' || !error.response) {
      console.warn('Backend server unreachable. Switched to offline Mock Mode.');
      useMockMode = true;
      return handleMockRequest(method, path, data);
    }
    
    // Bubble up API error message
    const message = error.response?.data?.message || 'API request failed';
    const err = new Error(message);
    err.status = error.response?.status;
    err.details = error.response?.data;
    throw err;
  }
};

export const get = (path, options = {}) => request('GET', path, null, options);
export const post = (path, body, options = {}) => request('POST', path, body, options);
export const put = (path, body, options = {}) => request('PUT', path, body, options);
export const del = (path, options = {}) => request('DELETE', path, null, options);

export default request;
