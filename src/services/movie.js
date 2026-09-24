import api from './api'

export const listMovies = (page = 0, size = 10, search = {}, type = "MOVIE") =>
    api.post('/movie/list', {
        page,
        size,
        search: {
            value: search.value ?? null,
            categoryId: search.categoryId ?? null,
            countryId: search.countryId ?? null,
            type: type
        },
    })

export const getMovie = (id) =>
    api.get(`/movie/get/${id}`)

export const upsertMovie = (movie) =>
    api.post('/movie/upsert', movie)

export const deleteMovie = (id) =>
    api.delete(`/movie/delete/${id}`)