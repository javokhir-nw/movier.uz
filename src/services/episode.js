import api from './api'

export const upsertEpisode = (episode) =>
    api.post('/episode/upsert', episode)

export const deleteEpisode = (id) =>
    api.delete(`/episode/delete/${id}`)