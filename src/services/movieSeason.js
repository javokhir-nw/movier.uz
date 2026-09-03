import api from './api'

export const upsertMovieSeason = (data) =>
    api.post('/movie-season/upsert', data)