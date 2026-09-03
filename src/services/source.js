import api from './api'

export const listSources = () =>
    api.get('/source/list')