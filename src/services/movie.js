import api from './api'

export const listMovies = (page = 0, size = 10, search = {}) =>
    api.post('/movie/list', {
        page,
        size,
        search: {
            value: search.value ?? null,
            categoryId: search.categoryId ?? null,
            type: "MOVIE"
        },
    })

export const getMovie = (id) =>
    api.get(`/movie/get/${id}`)

export const upsertMovie = (movie) =>
    api.post('/movie/upsert', movie)