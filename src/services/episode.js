import api from './api'

export const upsertEpisode = (episode) =>
    api.post('/episode/upsert', episode)