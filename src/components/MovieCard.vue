<script setup>
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

// Type ni infer qil - seasons bo'lsa SERIES, aks holda MOVIE
const movieType = props.movie.type || (props.movie.seasons ? 'SERIES' : 'MOVIE')
</script>

<template>
  <router-link
      :to="`/${movieType === 'SERIES' ? 'series' : 'movie'}/${movie.id}`"
      class="group block rounded-xl overflow-hidden bg-white/5 border border-white/10 hover:border-purple-400 transition hover:scale-[1.03]"
  >
    <div class="aspect-video bg-gradient-to-br from-purple-800 to-indigo-900 relative">
      <img
          v-if="movie.imageUrl"
          :src="movie.imageUrl"
          :alt="movie.title"
          class="w-full h-full object-cover"
      />

      <div
          v-else
          class="w-full h-full flex items-center justify-center text-white/40 text-4xl"
      >
        🎬
      </div>

      <!-- Type badge -->
      <div
          class="absolute top-2 left-2
           inline-flex items-center gap-1.5
           px-2.5 py-1
           rounded-lg
           bg-black/60
           border border-white/10
           text-white text-xs font-medium
           backdrop-blur-md
           shadow-lg"
      >
        <svg
          v-if="movieType === 'SERIES'"
          xmlns="http://www.w3.org/2000/svg"
          class="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <rect x="6" y="4" width="14" height="10" rx="1.5" stroke-linecap="round" stroke-linejoin="round" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 8v10a1.5 1.5 0 001.5 1.5H16" />
        </svg>
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          class="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
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
          class="absolute top-2 right-2
           inline-flex items-center gap-1.5
           px-3 py-1.5
           rounded-lg
           bg-black/60 hover:bg-purple-600/90
           border border-white/10 hover:border-purple-400/30
           text-white text-xs font-medium
           backdrop-blur-md
           shadow-lg
           transition-all duration-200
           hover:scale-105
           active:scale-95"
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

        <span>Tahrirlash</span>
      </button>
    </div>

    <div class="p-3">
      <h3
          class="text-white font-semibold truncate group-hover:text-purple-400 transition"
      >
        {{ movie.title }}
      </h3>

      <div class="flex gap-1 mt-1 flex-wrap">
        <span
            v-for="c in movie.categories"
            :key="c.id"
            class="text-xs text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded-full"
        >
          {{ c.name }}
        </span>
      </div>
    </div>
  </router-link>
</template>