const API_BASE_URL = '/api';

const getStoredToken = () => localStorage.getItem('survey_token');

const clearAuthState = () => {
  localStorage.removeItem('survey_token');
  localStorage.removeItem('survey_user');
  window.dispatchEvent(new Event('auth:logout'));
};

const request = async (path, options = {}) => {
  const token = getStoredToken();
  const headers = new Headers(options.headers || {});

  if (!(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    body: options.body instanceof FormData ? options.body : options.body ? JSON.stringify(options.body) : undefined,
  });

  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const data = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    if (response.status === 401) {
      clearAuthState();
    }

    const message = isJson && data && data.message ? data.message : 'Request failed';
    const error = new Error(message);
    error.status = response.status;
    error.details = data;
    throw error;
  }

  return data;
};

export const get = (path, options = {}) => request(path, { ...options, method: 'GET' });
export const post = (path, body, options = {}) => request(path, { ...options, method: 'POST', body });
export const put = (path, body, options = {}) => request(path, { ...options, method: 'PUT', body });
export const del = (path, options = {}) => request(path, { ...options, method: 'DELETE' });

export default request;
