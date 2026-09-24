import api from './api'

export const listCategories = () => api.get('/category/list')

export const upsertCategory = (data) => api.post('/category/upsert', data)

export const deleteCategory = (id) => api.delete(`/category/delete/${id}`)