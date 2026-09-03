import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    { path: '/', name: 'Home', component: () => import('../views/Home.vue') },
    { path: '/login', name: 'Login', component: () => import('../views/Login.vue') },
    { path: '/register', name: 'Register', component: () => import('../views/Register.vue') },
    { path: '/movies', name: 'Movies', component: () => import('../views/Movies.vue') },
    { path: '/movie/:id', name: 'MovieDetail', component: () => import('../views/MovieDetail.vue') },
    { path: '/series', name: 'Series', component: () => import('../views/Series.vue') },
    { path: '/series/:id', name: 'SeriesDetail', component: () => import('../views/SeriesDetail.vue') },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router