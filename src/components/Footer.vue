<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
const year = new Date().getFullYear()
</script>

<template>
  <footer class="bg-gradient-to-t from-slate-950 via-slate-900/50 to-transparent border-t border-white/10 mt-16 sm:mt-20">
    <div class="max-w-6xl mx-auto px-3 sm:px-4 md:pl-24 md:pr-10 py-12 sm:py-16">
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-12 mb-12">
        <!-- Brand -->
        <div class="md:col-span-1">
          <div class="flex items-center gap-2 mb-4">
            <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 10l4.55-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.45.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h2 class="text-white font-bold text-lg">Movier</h2>
              <p class="text-white/40 text-xs">Platform</p>
            </div>
          </div>
          <p class="text-white/60 text-sm leading-relaxed">Kinolar va seriallarning eng zo'r platformasi. Turli janr va tillardan tanla.</p>
        </div>

        <!-- Quick Links -->
        <div>
          <h3 class="text-white font-semibold text-sm mb-6 flex items-center gap-2">
            <span class="w-1 h-4 bg-gradient-to-b from-purple-400 to-indigo-600 rounded"></span>
            Tezkor Havolalar
          </h3>
          <ul class="space-y-3 text-sm">
            <li><router-link to="/" class="text-white/60 hover:text-purple-300 transition flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-purple-500"></span>Bosh sahifa</router-link></li>
            <li><router-link to="/movies" class="text-white/60 hover:text-purple-300 transition flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-purple-500"></span>Kinolar</router-link></li>
            <li><router-link to="/series" class="text-white/60 hover:text-purple-300 transition flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-purple-500"></span>Seriallar</router-link></li>
          </ul>
        </div>

        <!-- Account -->
        <div>
          <h3 class="text-white font-semibold text-sm mb-6 flex items-center gap-2">
            <span class="w-1 h-4 bg-gradient-to-b from-indigo-400 to-purple-600 rounded"></span>
            Akkount
          </h3>
          <ul class="space-y-3 text-sm">
            <li><router-link to="/login" class="text-white/60 hover:text-indigo-300 transition flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>Kirish</router-link></li>
            <li><router-link to="/register" class="text-white/60 hover:text-indigo-300 transition flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>Ro'yxatdan o'tish</router-link></li>
          </ul>
        </div>
      </div>

      <!-- Divider -->
      <div class="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8"></div>

      <!-- Bottom -->
      <div class="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm">
        <p class="text-white/40">&copy; {{ year }} <span class="text-white/60 font-semibold">Movier</span>. Barcha huquqlar himoyalangan.</p>
        <div class="flex gap-6">
          <a href="#" class="text-white/40 hover:text-white transition">Maxfiylik</a>
          <a href="#" class="text-white/40 hover:text-white transition">Shartlar</a>
          <a href="#" class="text-white/40 hover:text-white transition">Bog'lanish</a>
        </div>
      </div>
    </div>
  </footer>
</template>
