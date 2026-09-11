<script setup>
import { ref } from 'vue'

const props = defineProps({
  movie: {
    type: Object,
    required: true,
  },

  canEdit: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['edit'])
const imageLoaded = ref(false)

// Type ni infer qil - seasons bo'lsa SERIES, aks holda MOVIE
const movieType = props.movie.type || (props.movie.seasons ? 'SERIES' : 'MOVIE')

const onImageLoad = () => {
  imageLoaded.value = true
}
</script>

<template>
  <router-link
      :to="`/${movieType === 'SERIES' ? 'series' : 'movie'}/${movie.id}`"
      class="group block rounded-lg overflow-hidden bg-gradient-to-b from-white/5 to-white/[0.02] border border-white/10 hover:border-purple-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20"
  >
    <div class="relative overflow-hidden bg-gradient-to-br from-purple-900/50 to-indigo-900/50">
      <!-- Image container with better aspect ratio -->
      <div class="aspect-[2/3] relative overflow-hidden bg-slate-800/30">
        <!-- Skeleton loader / placeholder -->
        <div
            v-if="!imageLoaded"
            class="absolute inset-0 bg-gradient-to-r from-slate-800/50 via-slate-700/50 to-slate-800/50 animate-pulse"
        />

        <!-- Main image -->
        <img
            v-if="movie.imageUrl"
            :src="movie.imageUrl"
            :alt="movie.title"
            @load="onImageLoad"
            loading="lazy"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            :class="imageLoaded ? 'opacity-100' : 'opacity-0'"
        />

        <!-- Fallback emoji -->
        <div
            v-if="!movie.imageUrl"
            class="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-800 to-indigo-900 text-white/30 text-5xl"
        >
          🎬
        </div>

        <!-- Dark overlay on hover -->
        <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      <!-- Type badge - compact and top-left -->
      <div
          class="absolute top-2 left-2 inline-flex items-center gap-1 px-2 py-1 rounded-md bg-black/50 border border-white/20 text-white text-[10px] font-semibold backdrop-blur-sm transition-all duration-200"
      >
        <svg
          v-if="movieType === 'SERIES'"
          xmlns="http://www.w3.org/2000/svg"
          class="w-3 h-3"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2.5"
        >
          <rect x="6" y="4" width="14" height="10" rx="1.5" stroke-linecap="round" stroke-linejoin="round" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 8v10a1.5 1.5 0 001.5 1.5H16" />
        </svg>
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          class="w-3 h-3"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2.5"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 10l4.55-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.45.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
        <span>{{ movieType === 'SERIES' ? 'Serial' : 'Kino' }}</span>
      </div>

      <!-- Edit button -->
      <button
          v-if="canEdit"
          type="button"
          @click.stop.prevent="emit('edit', movie)"
          class="absolute top-2 right-2 inline-flex items-center justify-center w-7 h-7 rounded-md bg-black/50 hover:bg-purple-500/80 border border-white/20 text-white text-xs backdrop-blur-sm transition-all duration-200 hover:scale-110 active:scale-95"
      >
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            class="w-3.5 h-3.5"
        >
          <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 20h9"
          />
          <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M16.5 3.5a2.121 2.121 0 013 3L8 18l-4 1 1-4L16.5 3.5z"
          />
        </svg>
      </button>
    </div>

    <!-- Title section - more compact -->
    <div class="p-2 sm:p-2.5">
      <h3
          class="text-white font-semibold text-xs sm:text-sm leading-tight truncate group-hover:text-purple-300 transition-colors duration-200"
      >
        {{ movie.title }}
      </h3>

      <!-- Optional: Show first category only if needed, on hover -->
      <div
          v-if="movie.categories?.length"
          class="mt-1 text-[10px] sm:text-xs text-purple-300/60 truncate opacity-0 group-hover:opacity-100 transition-opacity duration-200"
      >
        {{ movie.categories[0].name }}
      </div>
    </div>
  </router-link>
</template>