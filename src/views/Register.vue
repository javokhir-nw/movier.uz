<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const username = ref('')
const password = ref('')
const error = ref('')
const auth = useAuthStore()
const router = useRouter()

onMounted(() => {
  if (auth.isAuthenticated) {
    router.push('/')
  }
})

const submit = async () => {
  error.value = ''
  try {
    await auth.register(username.value, password.value)
    router.push('/login')
  } catch (e) {
    error.value = 'Ro\'yxatdan o\'tishda xatolik'
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-slate-900 to-indigo-900 relative overflow-hidden">
    <div class="absolute -top-20 -left-20 w-96 h-96 bg-indigo-600 rounded-full blur-3xl opacity-30 animate-pulse"></div>
    <div class="absolute -bottom-20 -right-20 w-96 h-96 bg-purple-600 rounded-full blur-3xl opacity-30 animate-pulse"></div>

    <form @submit.prevent="submit" class="relative z-10 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 w-full max-w-sm flex flex-col gap-4 shadow-2xl">
      <h1 class="text-3xl font-bold text-white text-center mb-2">Movier</h1>

      <input v-model="username" placeholder="Username"
             class="bg-white/10 border border-white/30 text-white placeholder-white/50 p-3 rounded-lg outline-none focus:border-purple-400 transition" />

      <input v-model="password" type="password" placeholder="Password"
             class="bg-white/10 border border-white/30 text-white placeholder-white/50 p-3 rounded-lg outline-none focus:border-purple-400 transition" />

      <p v-if="error" class="text-red-400 text-sm text-center">{{ error }}</p>

      <button class="bg-gradient-to-r from-indigo-600 to-purple-600 hover:scale-[1.02] active:scale-95 text-white p-3 rounded-lg font-semibold transition">
        Ro'yxatdan o'tish
      </button>

      <router-link to="/login" class="text-white/60 text-sm text-center hover:text-white transition">
        Akkountingiz bormi? Kirish
      </router-link>
    </form>
  </div>
</template>