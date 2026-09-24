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
  <div class="min-h-screen bg-slate-950 pb-10">
    <p v-if="loading" class="text-white/40 text-center py-20">Yuklanmoqda...</p>

    <template v-else-if="movie">
      <!-- 1) ZAMONAVIY HERO BANNER -->
      <div class="relative w-full h-[600px] md:h-[500px] lg:h-[600px] bg-black overflow-hidden border-b border-white/5">
        <!-- Background Blur Image -->
        <div class="absolute inset-0 opacity-40">
          <img v-if="movie.imageUrl" :src="movie.imageUrl" class="w-full h-full object-cover blur-md scale-105" alt="Bg" />
        </div>
        <!-- Gradient Overlays -->
        <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent"></div>
        <div class="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/40 to-transparent"></div>

        <!-- Banner Content Area -->
        <div class="relative z-10 w-full max-w-7xl mx-auto h-full px-4 md:px-12 flex flex-col justify-end pb-12 pt-20">
          <div class="flex flex-col md:flex-row gap-8 items-end md:items-stretch">
            
            <!-- Chapda Poster (Desktop da ko'rinadi asosan) -->
            <div class="w-36 md:w-64 shrink-0 rounded-2xl overflow-hidden shadow-2xl border border-white/10 hidden sm:block bg-slate-900 group">
              <img v-if="movie.imageUrl" :src="movie.imageUrl" alt="Poster" class="w-full h-full object-cover aspect-[2/3] group-hover:scale-105 transition duration-500" />
            </div>

            <!-- Ma'lumotlar Qismi -->
            <div class="flex-grow flex flex-col justify-end">
              <!-- Kategoriyalar -->
              <div class="flex gap-2 mb-3 flex-wrap">
                <span v-for="c in movie.categories" :key="c.id" class="text-[10px] md:text-xs font-bold text-white uppercase tracking-widest bg-white/10 px-3 py-1 rounded border border-white/20 backdrop-blur-md">
                  {{ c.name }}
                </span>
              </div>
              
              <h1 class="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 drop-shadow-lg tracking-tight">
                {{ movie.title }}
              </h1>
              
              <p class="text-white/80 leading-relaxed text-sm md:text-base max-w-4xl mb-6 md:mb-8 line-clamp-3 md:line-clamp-none text-shadow-sm">
                {{ movie.description }}
              </p>

              <!-- Cast & Crew Glassmorphism Card (Pleyerdagi blok yuqoriga aylanadi) -->
              <div v-if="movie.director || (movie.actors && movie.actors.length)" class="bg-white/5 backdrop-blur-xl rounded-2xl p-4 md:p-5 border border-white/10 w-full max-w-4xl flex flex-col md:flex-row gap-6 shadow-2xl">
                
                <!-- Rejissyor -->
                <div v-if="movie.director" class="md:w-1/4 shrink-0 border-b md:border-b-0 md:border-r border-white/10 pb-4 md:pb-0 md:pr-4">
                  <h3 class="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-3">Rejissyor</h3>
                  <div class="flex items-center gap-3 group/person cursor-default">
                    <img v-if="movie.director.imageUrl" :src="movie.director.imageUrl" class="w-11 h-11 rounded-full object-cover shadow-lg group-hover/person:ring-2 ring-purple-500 transition" />
                    <div v-else class="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center shadow-lg"><span class="text-sm">🎬</span></div>
                    <span class="font-medium text-white/90 text-sm group-hover/person:text-purple-300 transition">{{ movie.director.name }}</span>
                  </div>
                </div>

                <!-- Bosh Rollarda (Actors) -->
                <div v-if="movie.actors && movie.actors.length" class="flex-grow">
                  <h3 class="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-3">Bosh rollarda</h3>
                  <div class="flex flex-wrap gap-3">
                    <div v-for="actor in movie.actors.slice(0, 5)" :key="actor.id" class="flex items-center gap-2 bg-white/5 hover:bg-white/10 transition rounded-full pr-3 pb-0.5 pt-0.5 pl-0.5 border border-white/5 group/actor cursor-default">
                      <img v-if="actor.imageUrl" :src="actor.imageUrl" class="w-8 h-8 rounded-full object-cover group-hover/actor:scale-110 transition duration-300 shadow-md" />
                      <div v-else class="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"><span class="text-xs">🎭</span></div>
                      <span class="text-xs text-white/80 font-medium group-hover/actor:text-white transition">{{ actor.name }}</span>
                    </div>
                    <div v-if="movie.actors.length > 5" class="flex items-center justify-center px-3 py-1 rounded-full border border-dashed border-white/20 text-xs text-white/40 cursor-default hover:text-white/60 hover:border-white/40 transition">
                      +{{ movie.actors.length - 5 }}
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>

      <!-- 2) PLEYER QISMI -->
      <div class="max-w-6xl mx-auto px-3 sm:px-4 md:pl-24 md:pr-10 mt-8 mb-12">
        <VideoPlayer :sources="movie.sources || []" :poster="movie.imageUrl" :movie-id="movie.id" />
      </div>

    </template>
  </div>
</template>