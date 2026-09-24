import api from './api'

export const listActors = () => api.get('/actor/list')

export const upsertActor = (data) => api.post('/actor/upsert', data)

export const deleteActor = (id) => api.delete(`/actor/delete/${id}`)
