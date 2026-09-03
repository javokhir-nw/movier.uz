import { defineStore } from 'pinia'
import { login as loginApi, register as registerApi } from '../services/auth'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: JSON.parse(localStorage.getItem('user')) || null,
    }),

    getters: {
        isAuthenticated: (state) => !!state.user?.token,

        displayName: (state) => {
            if (!state.user) return ''

            const { firstname, lastname, username } = state.user

            return firstname || lastname
                ? `${firstname ?? ''} ${lastname ?? ''}`.trim()
                : username
        },

        permissions: (state) => state.user?.permissions || [],

        role: (state) => state.user?.role || null,
    },

    actions: {
        async login(username, password) {
            const { data } = await loginApi(username, password)

            this.user = data

            localStorage.setItem(
                'user',
                JSON.stringify(data)
            )
        },

        async register(username, password) {
            const { data } = await registerApi(username, password)

            this.user = data

            localStorage.setItem(
                'user',
                JSON.stringify(data)
            )
        },

        hasPermission(permission) {
            return this.user?.permissions?.includes(permission) ?? false
        },

        hasAnyPermission(permissions) {
            if (!this.user?.permissions) return false

            return permissions.some(permission =>
                this.user.permissions.includes(permission)
            )
        },

        hasAllPermissions(permissions) {
            if (!this.user?.permissions) return false

            return permissions.every(permission =>
                this.user.permissions.includes(permission)
            )
        },

        logout() {
            this.user = null
            localStorage.removeItem('user')
        },
    },
})