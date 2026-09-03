import api from './api'

export const listSeries = (page = 0, size = 10, search = {}) =>
    api.post('/movie/list', {
        page,
        size,
        search: {
            value: search.value ?? null,
            categoryId: search.categoryId ?? null,
            type: "SERIES"
        },
    })

export const getSeries = (id) =>
    api.get(`/movie/get/${id}`)

export const upsertSeries = (series) =>
    api.post('/series/upsert', series)