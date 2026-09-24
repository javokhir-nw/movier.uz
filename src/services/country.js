import api from './api'

export const listCountries = () => api.get('/country/list')

export const upsertCountry = (data) => api.post('/country/upsert', data)

export const deleteCountry = (id) => api.delete(`/country/delete/${id}`)
