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
    const { data } = await listMovies(0, 20)
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
      px-4
      md:pl-24
      md:pr-10
      py-10
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
      <h2 class="text-xl font-semibold text-white mb-4">
        Barcha kinolar
      </h2>

      <p
          v-if="loading"
          class="text-white/40 text-center py-10"
      >
        Yuklanmoqda...
      </p>

      <div
          v-else
          class="
          grid
          grid-cols-2
          md:grid-cols-4
          lg:grid-cols-5
          gap-4
        "
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