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
  // auth
  login: (email, password) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  getMe: () => request('/auth/me'),

  // posts - admin sees all including unpublished
  getPosts: () => request('/posts?all=true'),
  getPost: (id) => request(`/posts/${id}?all=true`),
  createPost: (data) =>
    request('/posts', { method: 'POST', body: JSON.stringify(data) }),
  updatePost: (id, data) =>
    request(`/posts/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deletePost: (id) =>
    request(`/posts/${id}`, { method: 'DELETE' }),
  togglePublished: (id, published) =>
    request(`/posts/${id}`, { method: 'PUT', body: JSON.stringify({ published }) }),

  // comments
  getComments: (postId) => request(`/posts/${postId}/comments`),
  updateComment: (postId, id, content) =>
    request(`/posts/${postId}/comments/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ content }),
    }),
  deleteComment: (postId, id) =>
    request(`/posts/${postId}/comments/${id}`, { method: 'DELETE' }),
};
