import api from './api'

export const listSeasons = () => api.get('/season/list')

export const upsertSeason = (data) => api.post('/season/upsert', data)

export const deleteSeason = (id) => api.delete(`/season/delete/${id}`)