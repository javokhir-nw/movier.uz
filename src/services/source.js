import api from './api'

export const listSources = () => api.get('/source/list')

export const upsertSource = (data) => api.post('/source/upsert', data)

export const deleteSource = (id) => api.delete(`/source/delete/${id}`)