import api from './api'

export const upsertMovieSeason = (data) =>
    api.post('/movie-season/upsert', data)

export const deleteMovieSeason = (id) =>
    api.delete(`/movie-season/delete/${id}`)