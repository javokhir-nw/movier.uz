<script setup>
import { ref, onMounted } from 'vue'
import { listMovies } from '../services/movie'

import HeroCarousel from '../components/HeroCarousel.vue'
import MovieCard from '../components/MovieCard.vue'
import SearchModal from '../components/SearchModal.vue'

const movies = ref([])
const loading = ref(true)
const searchOpen = ref(false)

onMounted(async () => {
  try {
    const { data } = await listMovies(0, 20, {}, null)
    movies.value = data.content
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div
      class="
      min-h-screen
      bg-gradient-to-br
      from-purple-950
      via-slate-900
      to-indigo-950
      px-2
      sm:px-4
      md:pl-24
      md:pr-10
      py-6
      sm:py-10
    "
  >
    <div class="max-w-6xl mx-auto">

      <!-- Hero -->
      <HeroCarousel
          v-if="movies.length"
          :movies="movies.slice(0, 5)"
          class="mb-10"
      />

      <!-- Movies -->
      <div class="mb-4 sm:mb-6">
        <h2 class="text-lg sm:text-2xl font-bold text-white mb-1 tracking-tight">
          Barcha kino va seriallar
        </h2>
        <div class="h-0.5 w-10 sm:w-12 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-full"></div>
      </div>

      <p
          v-if="loading"
          class="text-white/40 text-center py-8 sm:py-12"
      >
        Yuklanmoqda...
      </p>

      <div
          v-else
          class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 sm:gap-3"
      >
        <MovieCard
            v-for="movie in movies"
            :key="movie.id"
            :movie="movie"
        />
      </div>

    </div>

    <SearchModal v-model="searchOpen" />
  </div>
</template>