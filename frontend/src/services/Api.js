import axios from 'axios';

const API_BASE_URL = 'http://localhost:3333/api';

export const useJwtToken = () => {
  const jwtToken = localStorage.getItem('jwtToken');
  if (jwtToken) {
    api.defaults.headers.common['Authorization'] = `Bearer ${jwtToken}`;
  }
};

export const setJwtToken = (token) => {
  localStorage.setItem('jwtToken', token);
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

export const removeJwtToken = () => {
  localStorage.removeItem('jwtToken');
  delete api.defaults.headers.common['Authorization'];
};

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getAllBooks = () => api.get('/books');
export const getBookById = (id) => api.get(`/books/${id}`);
export const createBook = (bookData) => api.post('/books', bookData);
export const updateBook = (id, bookData) => api.put(`/books/${id}`, bookData);
export const deleteBook = (id) => api.delete(`/books/${id}`);