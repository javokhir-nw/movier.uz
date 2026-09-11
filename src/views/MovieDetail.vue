<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getMovie } from '../services/movie'
import { getVideoType } from '../utils/videoSource'
import VideoPlayer from "../components/VideoPlayer.vue";

const route = useRoute()
const movie = ref(null)
const loading = ref(true)
const selectedSourceId = ref(null)
const videoRef = ref(null)

const sortedSources = computed(() => {
  if (!movie.value?.sources) return []
  return [...movie.value.sources].sort((a, b) => a.orderNumber - b.orderNumber)
})

const activeUrl = computed(() => {
  const found = sortedSources.value.find((s) => s.sourceId === selectedSourceId.value)
  return found?.url || sortedSources.value[sortedSources.value.length - 1]?.url
})

const isYoutubeFallback = computed(() => !sortedSources.value.length && movie.value?.url && getVideoType(movie.value.url) === 'youtube')

const skip = (sec) => {
  if (videoRef.value) videoRef.value.currentTime += sec
}

onMounted(async () => {
  try {
    const { data } = await getMovie(route.params.id)
    movie.value = data
    if (data.sources?.length) {
      const sorted = [...data.sources].sort((a, b) => a.orderNumber - b.orderNumber)
      selectedSourceId.value = sorted[sorted.length - 1].sourceId
    }
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-950 via-slate-900 to-indigo-950 px-3 sm:px-4 md:pl-24 md:pr-10 pt-4 sm:pt-5 pb-10">
    <div class="max-w-6xl mx-auto">

      <p v-if="loading" class="text-white/40 text-center py-10">Yuklanmoqda...</p>

      <template v-else-if="movie">
        <!-- Top: image full width + info -->
        <div class="rounded-xl sm:rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-purple-900/50 mb-6 sm:mb-8 bg-black aspect-video">
          <img v-if="movie.imageUrl" :src="movie.imageUrl" :alt="movie.title" class="w-full h-full object-cover" />
        </div>

        <!-- Info section -->
        <div class="mb-8">
          <h1 class="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3">{{ movie.title }}</h1>

          <div class="flex gap-2 mb-4 sm:mb-6 flex-wrap">
            <span v-for="c in movie.categories" :key="c.id" class="text-xs sm:text-sm text-purple-300 bg-purple-500/10 hover:bg-purple-500/20 px-3 py-1 rounded-lg transition">
              {{ c.name }}
            </span>
          </div>

          <p class="text-white/70 leading-relaxed text-sm sm:text-base max-w-3xl">{{ movie.description }}</p>
        </div>

        <!-- Video Player -->
        <VideoPlayer :sources="movie.sources || []" :poster="movie.imageUrl" :movie-id="movie.id" />
      </template>
    </div>
  </div>
</template>