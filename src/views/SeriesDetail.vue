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

// Faqat direct episodes bo'lsa seasons qo'sha olmasin
// Seasons bo'lsa ko'proq seasons qo'shish mumkin
const canAddSeason = computed(() => !hasDirectEpisodes.value)

// Empty series: seasons ham episodes ham yo'q
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
  // Agar fasllar bor bo'lsa, fasl tanlangan bo'lishi kerak
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

  // Yangi qo'shilgan faslni avtomatik tanlash
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
  <div class="min-h-screen bg-gradient-to-br from-purple-950 via-slate-900 to-indigo-950 px-3 sm:px-4 md:pl-24 md:pr-10 pt-4 sm:pt-5 pb-10">
    <div class="max-w-6xl mx-auto">

      <p v-if="loading" class="text-white/40 text-center py-10">Yuklanmoqda...</p>

      <template v-else-if="series">
        <!-- Top: image full width + info -->
        <div class="rounded-xl sm:rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-purple-900/50 mb-6 sm:mb-8 bg-black aspect-video">
          <img v-if="series.imageUrl" :src="series.imageUrl" :alt="series.title" class="w-full h-full object-cover" />
        </div>

        <!-- Info section -->
        <div class="mb-8">
          <h1 class="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3">{{ series.title }}</h1>

          <div class="flex gap-2 mb-4 sm:mb-6 flex-wrap">
            <span v-for="c in series.categories" :key="c.id" class="text-xs sm:text-sm text-purple-300 bg-purple-500/10 hover:bg-purple-500/20 px-3 py-1 rounded-lg transition">
              {{ c.name }}
            </span>
          </div>

          <p class="text-white/70 leading-relaxed text-sm sm:text-base max-w-3xl">{{ series.description }}</p>
        </div>

        <!-- Seasons (if available) -->
        <div v-if="hasSeason" class="mb-12">
          <div class="flex items-center justify-end mb-6">
            <button
              v-if="auth.hasPermission('upsert movie') && canAddSeason"
              @click="openAddSeason"
              class="text-xs sm:text-sm bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white px-4 py-2 rounded-lg transition shadow-lg shadow-purple-500/20"
            >
              + Fasl qo'shish
            </button>
          </div>
          <div class="flex gap-3 flex-wrap">
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
                {{ season.seasonName || `Fasl ${season.orderNumber}` }}
              </span>
            </button>
          </div>
        </div>

        <!-- Episodes -->
        <div v-if="sortedDisplayEpisodes.length || hasSeason" class="mb-8">
          <div class="flex items-center justify-end mb-6">
            <button
              v-if="auth.hasPermission('upsert movie') && (!hasSeason || selectedSeasonId)"
              @click="openAddEpisode(selectedSeasonId)"
              class="text-xs sm:text-sm bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white px-4 py-2 rounded-lg transition shadow-lg shadow-indigo-500/20"
            >
              + Qism qo'shish
            </button>
          </div>

          <!-- Episodes Grid -->
          <div v-if="sortedDisplayEpisodes.length" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            <button
              v-for="episode in sortedDisplayEpisodes"
              :key="episode.id"
              @click="selectEpisode(episode)"
              class="group relative p-3 sm:p-4 rounded-lg border transition-all duration-300 text-left overflow-hidden"
              :class="
                selectedEpisode?.id === episode.id
                  ? 'bg-gradient-to-br from-purple-600/60 to-purple-500/30 border-purple-400/60 text-white shadow-lg shadow-purple-500/30 scale-[1.02]'
                  : 'bg-white/[0.03] border-white/15 text-white/70 hover:bg-white/[0.08] hover:border-white/30 hover:text-white'
              "
            >
              <!-- Animated background effect -->
              <div v-if="selectedEpisode?.id === episode.id" class="absolute inset-0 bg-gradient-to-r from-purple-400/10 via-transparent to-purple-400/10 animate-pulse pointer-events-none"></div>

              <div class="relative z-10">
                <div class="flex items-center gap-2 mb-1">
                  <span class="font-bold text-xs sm:text-sm bg-white/10 px-2.5 py-0.5 rounded">{{ episode.orderNumber }}</span>
                  <span v-if="selectedEpisode?.id === episode.id" class="inline-block w-2 h-2 rounded-full bg-purple-300 animate-pulse"></span>
                </div>
                <div v-if="episode.title" class="text-[10px] sm:text-xs text-white/60 line-clamp-2 group-hover:text-white/80">{{ episode.title }}</div>
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

        <!-- No content -->
        <div v-else class="text-center py-10">
          <!-- Empty series - can choose path -->
          <template v-if="canChoosePath">
            <p class="text-white/40 mb-4">Bu serialga qism yoki fasl qo'shish kerak</p>
            <button
              v-if="auth.hasPermission('upsert movie')"
              @click="openAddEpisode(null)"
              class="mt-4 text-purple-400 hover:text-purple-300"
            >
              + Birinchi qism qo'shish (bevosita)
            </button>
            <button
              v-if="auth.hasPermission('upsert movie')"
              @click="openAddSeason"
              class="mt-2 ml-2 text-purple-400 hover:text-purple-300"
            >
              + Fasl qo'shish
            </button>
          </template>

          <!-- Series with seasons - need to select season first -->
          <template v-else-if="hasSeason">
            <p class="text-white/40 mb-2">📺 Bu serial fasllar bilan tashkil topgan</p>
            <p class="text-white/50 text-sm mb-4">Faslni tanlang va qism qo'shish tugmasini bosing</p>
            <button
              v-if="auth.hasPermission('upsert movie') && canAddSeason"
              @click="openAddSeason"
              class="mt-2 text-purple-400 hover:text-purple-300"
            >
              + Ko'proq fasl qo'shish
            </button>
          </template>

          <!-- Series with direct episodes - can't add seasons -->
          <template v-else-if="hasDirectEpisodes">
            <p class="text-white/40 mb-2">🎬 Bu serial bevosita episodlar bilan</p>
            <p class="text-white/50 text-sm mb-4">Yangi episodlar qo'shishingiz mumkin</p>
            <button
              v-if="auth.hasPermission('upsert movie')"
              @click="openAddEpisode(null)"
              class="mt-2 text-purple-400 hover:text-purple-300"
            >
              + Episod qo'shish
            </button>
          </template>
        </div>
      </template>
    </div>

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
