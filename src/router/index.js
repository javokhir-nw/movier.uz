import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    { path: '/', name: 'Home', component: () => import('../views/Home.vue') },
    { path: '/login', name: 'Login', component: () => import('../views/Login.vue') },
    { path: '/register', name: 'Register', component: () => import('../views/Register.vue') },
    { path: '/movies', name: 'Movies', component: () => import('../views/Movies.vue') },
    { path: '/movie/:id', name: 'MovieDetail', component: () => import('../views/MovieDetail.vue') },
    { path: '/series', name: 'Series', component: () => import('../views/Series.vue') },
    { path: '/series/:id', name: 'SeriesDetail', component: () => import('../views/SeriesDetail.vue') },
    { path: '/categories', name: 'Categories', component: () => import('../views/Categories.vue') },
    { path: '/seasons', name: 'Seasons', component: () => import('../views/Seasons.vue') },
    { path: '/sources', name: 'Sources', component: () => import('../views/Sources.vue') },
    { path: '/actors', name: 'Actors', component: () => import('../views/Actors.vue') },
    { path: '/countries', name: 'Countries', component: () => import('../views/Countries.vue') },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router