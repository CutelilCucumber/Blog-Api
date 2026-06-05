const SERVER_URL = import.meta.env.VITE_SERVER_URL;

function getToken() {
  return localStorage.getItem('token');
}

function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(path, options = {}) {
  const res = await fetch(`${SERVER_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...authHeaders(), ...options.headers },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

export const api = {
  getPosts: () => request('/posts'),
  getPost: (id) => request(`/posts/${id}`),
  getComments: (postId) => request(`/posts/${postId}/comments`),
  createComment: (postId, content) =>
    request(`/posts/${postId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    }),
  deleteComment: (postId, id) =>
    request(`/posts/${postId}/comments/${id}`, { method: 'DELETE' }),
  login: (email, password) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  register: (username, email, password) =>
    request('/auth/register', { method: 'POST', body: JSON.stringify({ username, email, password }) }),
  getMe: () => request('/auth/me'),
};
