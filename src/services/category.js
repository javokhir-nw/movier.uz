import api from './api'

export const listCategories = () => api.get('/category/list')