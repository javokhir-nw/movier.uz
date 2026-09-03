import api from './api'

export const listSeasons = () => api.get('/season/list')