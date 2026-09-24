<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getMovie } from '../services/movie'
import { listSources } from '../services/source'
import { useAuthStore } from '../stores/auth'
import VideoPlayer from "../components/VideoPlayer.vue"
import SeasonManager from "../components/SeasonManager.vue"
import EpisodeForm from "../components/EpisodeForm.vue"

const route = useRoute()
const auth = useAuthStore()
const series = ref(null)
const sources = ref([])
const loading = ref(true)
const selectedEpisode = ref(null)
const selectedSeasonId = ref(null)

const showSeasonManager = ref(false)
const showEpisodeForm = ref(false)
const selectedSeasonForEpisode = ref(null)

const hasSeason = computed(() => series.value?.seasons && series.value.seasons.length > 0)

const hasDirectEpisodes = computed(() => series.value?.episodes && series.value.episodes.length > 0)

const canAddSeason = computed(() => !hasDirectEpisodes.value)

const canChoosePath = computed(() => !hasSeason.value && !hasDirectEpisodes.value)

const displayEpisodes = computed(() => {
  if (hasSeason.value) {
    const season = series.value.seasons.find(s => s.id === selectedSeasonId.value)
    return season?.episodes || []
  }
  return series.value?.episodes || []
})

const sortedDisplayEpisodes = computed(() => {
  return [...displayEpisodes.value].sort((a, b) => a.orderNumber - b.orderNumber)
})

onMounted(async () => {
  try {
    const [seriesData, sourcesData] = await Promise.all([
      getMovie(route.params.id),
      listSources(),
    ])

    series.value = seriesData.data
    sources.value = sourcesData.data

    if (hasSeason.value) {
      selectedSeasonId.value = series.value.seasons[0].id
      if (series.value.seasons[0].episodes?.length) {
        selectedEpisode.value = series.value.seasons[0].episodes[0]
      }
    } else if (series.value.episodes?.length) {
      selectedEpisode.value = series.value.episodes[0]
    }
  } finally {
    loading.value = false
  }
})

const selectEpisode = (episode) => {
  selectedEpisode.value = episode
}

const selectSeason = (seasonId) => {
  selectedSeasonId.value = seasonId
  const season = series.value.seasons.find(s => s.id === seasonId)
  if (season?.episodes?.length) {
    selectedEpisode.value = season.episodes[0]
  }
}

const openAddSeason = () => {
  showSeasonManager.value = true
}

const openAddEpisode = (seasonId = null) => {
  if (hasSeason.value && !seasonId) {
    alert('Iltimos, faslni tanlang')
    return
  }
  selectedSeasonForEpisode.value = seasonId || null
  showEpisodeForm.value = true
}

const handleSeasonAdded = async () => {
  showSeasonManager.value = false
  const { data } = await getMovie(route.params.id)
  series.value = data

  if (hasSeason.value && !selectedSeasonId.value) {
    selectedSeasonId.value = series.value.seasons[0].id
  }
}

const handleEpisodeAdded = async () => {
  showEpisodeForm.value = false
  const { data } = await getMovie(route.params.id)
  series.value = data
}
</script>

<template>
  <div class="min-h-screen bg-slate-950 pb-10">
    <p v-if="loading" class="text-white/40 text-center py-20">Yuklanmoqda...</p>

    <template v-else-if="series">
      
      <!-- 1) ZAMONAVIY HERO BANNER -->
      <div class="relative w-full h-[600px] md:h-[500px] lg:h-[600px] bg-black overflow-hidden border-b border-white/5">
        <!-- Background Blur Image -->
        <div class="absolute inset-0 opacity-40">
          <img v-if="series.imageUrl" :src="series.imageUrl" class="w-full h-full object-cover blur-md scale-105" alt="Bg" />
        </div>
        <!-- Gradient Overlays -->
        <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent"></div>
        <div class="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/40 to-transparent"></div>

        <!-- Banner Content Area -->
        <div class="relative z-10 w-full max-w-7xl mx-auto h-full px-4 md:px-12 flex flex-col justify-end pb-12 pt-20">
          <div class="flex flex-col md:flex-row gap-8 items-end md:items-stretch">
            
            <!-- Chapda Poster (Desktop da ko'rinadi asosan) -->
            <div class="w-36 md:w-64 shrink-0 rounded-2xl overflow-hidden shadow-2xl border border-white/10 hidden sm:block bg-slate-900 group">
              <img v-if="series.imageUrl" :src="series.imageUrl" alt="Poster" class="w-full h-full object-cover aspect-[2/3] group-hover:scale-105 transition duration-500" />
            </div>

            <!-- Ma'lumotlar Qismi -->
            <div class="flex-grow flex flex-col justify-end">
              <!-- Kategoriyalar -->
              <div class="flex gap-2 mb-3 flex-wrap">
                <span v-for="c in series.categories" :key="c.id" class="text-[10px] md:text-xs font-bold text-white uppercase tracking-widest bg-white/10 px-3 py-1 rounded border border-white/20 backdrop-blur-md">
                  {{ c.name }}
                </span>
                <span class="text-[10px] md:text-xs font-bold text-indigo-300 uppercase tracking-widest bg-indigo-500/10 px-3 py-1 rounded border border-indigo-500/20 backdrop-blur-md">
                  Serial
                </span>
              </div>
              
              <h1 class="text-4xl md:text-5xl lg:text-7xl font-black text-white mb-4 drop-shadow-lg tracking-tight">
                {{ series.title }}
              </h1>
              
              <p class="text-white/80 leading-relaxed text-sm md:text-base max-w-4xl mb-6 md:mb-8 line-clamp-3 md:line-clamp-none text-shadow-sm">
                {{ series.description }}
              </p>

              <!-- Cast & Crew Glassmorphism Card (Pleyerdagi blok yuqoriga aylanadi) -->
              <div v-if="series.director || (series.actors && series.actors.length)" class="bg-white/5 backdrop-blur-xl rounded-2xl p-4 md:p-5 border border-white/10 w-full max-w-4xl flex flex-col md:flex-row gap-6 shadow-2xl">
                
                <!-- Rejissyor -->
                <div v-if="series.director" class="md:w-1/4 shrink-0 border-b md:border-b-0 md:border-r border-white/10 pb-4 md:pb-0 md:pr-4">
                  <h3 class="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-3">Rejissyor</h3>
                  <div class="flex items-center gap-3 group/person cursor-default">
                    <img v-if="series.director.imageUrl" :src="series.director.imageUrl" class="w-11 h-11 rounded-full object-cover shadow-lg group-hover/person:ring-2 ring-purple-500 transition" />
                    <div v-else class="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center shadow-lg"><span class="text-sm">🎬</span></div>
                    <span class="font-medium text-white/90 text-sm group-hover/person:text-purple-300 transition">{{ series.director.name }}</span>
                  </div>
                </div>

                <!-- Bosh Rollarda (Actors) -->
                <div v-if="series.actors && series.actors.length" class="flex-grow">
                  <h3 class="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-3">Bosh rollarda</h3>
                  <div class="flex flex-wrap gap-3">
                    <div v-for="actor in series.actors.slice(0, 5)" :key="actor.id" class="flex items-center gap-2 bg-white/5 hover:bg-white/10 transition rounded-full pr-3 pb-0.5 pt-0.5 pl-0.5 border border-white/5 group/actor cursor-default">
                      <img v-if="actor.imageUrl" :src="actor.imageUrl" class="w-8 h-8 rounded-full object-cover group-hover/actor:scale-110 transition duration-300 shadow-md" />
                      <div v-else class="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"><span class="text-xs">🎭</span></div>
                      <span class="text-xs text-white/80 font-medium group-hover/actor:text-white transition">{{ actor.name }}</span>
                    </div>
                    <div v-if="series.actors.length > 5" class="flex items-center justify-center px-3 py-1 rounded-full border border-dashed border-white/20 text-xs text-white/40 cursor-default hover:text-white/60 hover:border-white/40 transition">
                      +{{ series.actors.length - 5 }}
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>

      <!-- 2) QISMLAR VA VIDEOPLAYER -->
      <div class="max-w-6xl mx-auto px-3 sm:px-4 md:pl-24 md:pr-10 mt-8 mb-12">
        
        <!-- Seasons (if available) -->
         <div v-if="hasSeason" class="mb-10">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-bold text-white">Fasllar</h2>
            <button
              v-if="auth.hasPermission('upsert movie') && canAddSeason"
              @click="openAddSeason"
              class="text-[10px] sm:text-xs bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white px-3 py-1.5 rounded-lg transition shadow-lg shadow-purple-500/20"
            >
              + Fasl qo'shish
            </button>
          </div>
          
          <div class="flex gap-2.5 flex-wrap">
            <button
              v-for="season in series.seasons"
              :key="season.id"
              @click="selectSeason(season.id)"
              class="group relative px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg font-medium transition-all text-xs sm:text-sm duration-300"
              :class="
                selectedSeasonId === season.id
                  ? 'bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-lg shadow-purple-500/30 scale-105'
                  : 'bg-white/[0.04] border border-white/15 text-white/70 hover:bg-white/[0.08] hover:border-white/30 hover:text-white'
              "
            >
              <span class="flex items-center gap-2">
                <span v-if="selectedSeasonId === season.id" class="w-1.5 h-1.5 rounded-full bg-purple-300 animate-pulse"></span>
                {{ season.seasonName || `${season.orderNumber}-Fasl` }}
              </span>
            </button>
          </div>
        </div>

        <!-- Episodes -->
        <div v-if="sortedDisplayEpisodes.length || hasSeason" class="mb-8">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-bold text-white">Qismlar</h2>
            <button
              v-if="auth.hasPermission('upsert movie') && (!hasSeason || selectedSeasonId)"
              @click="openAddEpisode(selectedSeasonId)"
              class="text-[10px] sm:text-xs bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white px-3 py-1.5 rounded-lg transition shadow-lg shadow-indigo-500/20"
            >
              + Qism qo'shish
            </button>
          </div>

          <!-- Episodes Grid -->
          <div v-if="sortedDisplayEpisodes.length" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            <button
              v-for="episode in sortedDisplayEpisodes"
              :key="episode.id"
              @click="selectEpisode(episode)"
              class="group relative p-3 sm:p-4 rounded-xl border transition-all duration-300 text-left overflow-hidden"
              :class="
                selectedEpisode?.id === episode.id
                  ? 'bg-gradient-to-br from-purple-600/60 to-purple-500/30 border-purple-400/60 text-white shadow-lg shadow-purple-500/30 scale-105'
                  : 'bg-slate-900 border-white/10 text-white/70 hover:bg-slate-800 hover:border-white/30 hover:text-white'
              "
            >
              <!-- Animated background effect -->
              <div v-if="selectedEpisode?.id === episode.id" class="absolute inset-0 bg-gradient-to-r from-purple-400/10 via-transparent to-purple-400/10 animate-pulse pointer-events-none"></div>

              <div class="relative z-10 flex flex-col h-full justify-between gap-2">
                <div class="flex items-center gap-2">
                  <span class="font-bold text-lg leading-none" :class="selectedEpisode?.id === episode.id ? 'text-white' : 'text-white/40'">{{ episode.orderNumber }}</span>
                  <span v-if="selectedEpisode?.id === episode.id" class="inline-block w-1.5 h-1.5 rounded-full bg-purple-300 animate-pulse"></span>
                </div>
                <div v-if="episode.title" class="text-[10px] sm:text-xs font-medium line-clamp-2 leading-tight group-hover:text-white/90" :class="selectedEpisode?.id === episode.id ? 'text-white/90' : 'text-white/60'">{{ episode.title }}</div>
              </div>
            </button>
          </div>
        </div>

        <!-- Video Player -->
        <VideoPlayer
          v-if="selectedEpisode"
          :sources="selectedEpisode.sources || []"
          :poster="series.imageUrl"
          :movie-id="selectedEpisode.id"
        />

        <!-- No content message state -->
        <div v-else class="text-center py-16 bg-slate-900/50 rounded-2xl border border-white/5 mb-8">
          <template v-if="canChoosePath">
            <p class="text-white/40 mb-4">Bu serialga hali qism yoki fasl qo'shilmagan.</p>
            <div class="flex justify-center gap-3">
              <button
                v-if="auth.hasPermission('upsert movie')"
                @click="openAddEpisode(null)"
                class="px-4 py-2 rounded-lg bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 text-sm transition"
              >
                + Bitta epizod qo'shish
              </button>
              <button
                v-if="auth.hasPermission('upsert movie')"
                @click="openAddSeason"
                class="px-4 py-2 rounded-lg bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 text-sm transition"
              >
                + Fasl qo'shish
              </button>
            </div>
          </template>

          <template v-else-if="hasSeason">
            <p class="text-white/40 mb-2">Bu serial fasllar bilan tashkil topgan</p>
            <p class="text-white/50 text-sm mb-4">Faslni tanlang va qism qo'shish tugmasini bosing</p>
          </template>

          <template v-else-if="hasDirectEpisodes">
            <p class="text-white/40 mb-2">Bu serial bevosita episodlar orqali uzatiladi</p>
            <p class="text-white/50 text-sm mb-4">Qism yaratilmagan</p>
            <button
              v-if="auth.hasPermission('upsert movie')"
              @click="openAddEpisode(null)"
              class="px-4 py-2 rounded-lg bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 text-sm transition"
            >
              + Episod qo'shish
            </button>
          </template>
        </div>

      </div>
    </template>

    <!-- Season Manager Modal -->
    <SeasonManager
      v-if="showSeasonManager"
      :series-id="series?.id"
      :seasons="series?.seasons || []"
      @close="showSeasonManager = false"
      @saved="handleSeasonAdded"
    />

    <!-- Episode Form Modal -->
    <EpisodeForm
      v-if="showEpisodeForm"
      :series-id="series?.id"
      :season-id="selectedSeasonForEpisode"
      :sources="sources"
      @close="showEpisodeForm = false"
      @saved="handleEpisodeAdded"
    />
  </div>
</template>
