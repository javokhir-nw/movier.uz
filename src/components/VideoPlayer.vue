<script setup>
import { ref, computed, onMounted } from 'vue'

const props = defineProps({
  sources: { type: Array, default: () => [] },
  poster: { type: String, default: '' },
  movieId: { type: [String, Number], required: true },
})

const videoRef = ref(null)
const containerRef = ref(null)

const playing = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const volume = ref(1)
const showQualityMenu = ref(false)
const activeSourceId = ref(null)
const pendingResume = ref(null)

const storageKey = `movie_progress_${props.movieId}`
let lastSave = 0

const sortedSources = computed(() => [...props.sources].sort((a, b) => a.orderNumber - b.orderNumber))
const activeSource = computed(() => sortedSources.value.find((s) => s.sourceId === activeSourceId.value) || sortedSources.value[sortedSources.value.length - 1])

const progressPercent = computed(() => (duration.value ? (currentTime.value / duration.value) * 100 : 0))

const formatTime = (sec) => {
  if (!sec || isNaN(sec)) return '0:00'
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

const togglePlay = () => {
  if (!videoRef.value) return
  playing.value ? videoRef.value.pause() : videoRef.value.play()
}

const onPlay = () => (playing.value = true)
const onPause = () => (playing.value = false)

const saveProgress = () => {
  if (currentTime.value > 5 && duration.value - currentTime.value > 5) {
    localStorage.setItem(storageKey, currentTime.value.toString())
  }
}

const onTimeUpdate = () => {
  currentTime.value = videoRef.value?.currentTime || 0
  const now = Date.now()
  if (now - lastSave > 3000) {
    saveProgress()
    lastSave = now
  }
}

const onLoadedMeta = () => {
  duration.value = videoRef.value?.duration || 0

  if (pendingResume.value) {
    videoRef.value.currentTime = pendingResume.value.time
    if (pendingResume.value.wasPlaying) videoRef.value.play()
    pendingResume.value = null
    return
  }

  const saved = localStorage.getItem(storageKey)
  if (saved && videoRef.value) {
    videoRef.value.currentTime = Number(saved)
  }
}

const onEnded = () => {
  localStorage.removeItem(storageKey)
}

const skip = (sec) => {
  if (videoRef.value) videoRef.value.currentTime = Math.min(Math.max(videoRef.value.currentTime + sec, 0), duration.value)
}

const seek = (e) => {
  const rect = e.currentTarget.getBoundingClientRect()
  const ratio = (e.clientX - rect.left) / rect.width
  if (videoRef.value) videoRef.value.currentTime = ratio * duration.value
}

const setVolume = (e) => {
  volume.value = Number(e.target.value)
  if (videoRef.value) videoRef.value.volume = volume.value
}

const selectSource = (id) => {
  pendingResume.value = { time: currentTime.value, wasPlaying: playing.value }
  activeSourceId.value = id
  showQualityMenu.value = false
}

const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    containerRef.value?.requestFullscreen?.()
  } else {
    document.exitFullscreen?.()
  }
}

onMounted(() => {
  if (sortedSources.value.length) {
    activeSourceId.value = sortedSources.value[sortedSources.value.length - 1].sourceId
  }
})
</script>

<template>
  <div ref="containerRef" class="relative w-full aspect-video bg-black rounded-xl overflow-hidden group select-none">
    <video
        v-if="activeSource"
        ref="videoRef"
        :key="activeSource.url"
        :src="activeSource.url"
        :poster="poster"
        class="w-full h-full"
        @click.stop="togglePlay"
        @play="onPlay"
        @pause="onPause"
        @timeupdate="onTimeUpdate"
        @loadedmetadata="onLoadedMeta"
        @ended="onEnded"
    ></video>

    <div v-else class="w-full h-full flex items-center justify-center text-white/40">
      Video manba topilmadi
    </div>

    <button
        v-if="activeSource && !playing"
        @click="togglePlay"
        class="absolute inset-0 flex items-center justify-center"
    >
      <span class="w-16 h-16 rounded-full bg-purple-600/90 hover:bg-purple-500 flex items-center justify-center transition shadow-xl">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7 text-white ml-1" viewBox="0 0 24 24" fill="currentColor">
          <path d="M8 5v14l11-7z" />
        </svg>
      </span>
    </button>

    <div v-if="activeSource" class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent px-4 pt-8 pb-3 opacity-0 group-hover:opacity-100 transition-opacity">
      <div @click="seek" class="w-full h-1.5 bg-white/20 rounded-full cursor-pointer mb-3 relative">
        <div class="h-full bg-purple-500 rounded-full" :style="{ width: progressPercent + '%' }"></div>
      </div>

      <div class="flex items-center justify-between gap-3 flex-wrap">
        <div class="flex items-center gap-3">
          <button @click.stop="togglePlay" type="button" class="text-white hover:text-purple-400 transition">
            <svg v-if="!playing" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M6 5h4v14H6zm8 0h4v14h-4z" /></svg>
          </button>

          <button @click.stop="skip(-10)" type="button" class="text-white/70 hover:text-white transition">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
          <button @click.stop="skip(10)" type="button" class="text-white/70 hover:text-white transition">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
          </button>

          <span class="text-white/60 text-xs">{{ formatTime(currentTime) }} / {{ formatTime(duration) }}</span>

          <input type="range" min="0" max="1" step="0.05" :value="volume" @input="setVolume" class="w-16 accent-purple-500" />
        </div>

        <div class="flex items-center gap-2 relative">
          <button
              v-if="sortedSources.length > 1"
              @click="showQualityMenu = !showQualityMenu"
              class="text-white/70 hover:text-white text-xs px-2 py-1 rounded border border-white/20 transition"
          >
            {{ activeSource?.sourceName }}
          </button>

          <div v-if="showQualityMenu" class="absolute bottom-8 right-16 bg-slate-900 border border-white/10 rounded-lg overflow-hidden shadow-xl">
            <button
                v-for="s in sortedSources"
                :key="s.sourceId"
                @click="selectSource(s.sourceId)"
                class="block w-full text-left px-4 py-2 text-xs whitespace-nowrap transition"
                :class="s.sourceId === activeSourceId ? 'bg-purple-600 text-white' : 'text-white/70 hover:bg-white/10'"
            >
              {{ s.sourceName }}
            </button>
          </div>

          <button @click="toggleFullscreen" class="text-white/70 hover:text-white transition">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-5v4m0-4h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>