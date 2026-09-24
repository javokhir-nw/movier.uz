<script setup>
defineProps({
  movie: {
    type: Object,
    required: true,
  },

  canEdit: {
    type: Boolean,
    default: false,
  },

  canDelete: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['edit', 'delete'])
</script>

<template>
  <router-link
      :to="`/series/${movie.id}`"
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

      <!-- Action buttons -->
      <div v-if="canEdit || canDelete" class="absolute top-2 right-2 flex gap-1.5">
        <button
            v-if="canEdit"
            type="button"
            @click.stop.prevent="emit('edit', movie)"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/60 hover:bg-purple-600/90 border border-white/10 hover:border-purple-400/30 text-white text-xs font-medium backdrop-blur-md shadow-lg transition-all duration-200 hover:scale-105 active:scale-95"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-3.5 h-3.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 20h9" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 3.5a2.121 2.121 0 013 3L8 18l-4 1 1-4L16.5 3.5z" />
          </svg>
          <span>Tahrirlash</span>
        </button>

        <button
            v-if="canDelete"
            type="button"
            @click.stop.prevent="emit('delete', movie)"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/60 hover:bg-red-600/90 border border-white/10 hover:border-red-400/30 text-white text-xs font-medium backdrop-blur-md shadow-lg transition-all duration-200 hover:scale-105 active:scale-95"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-3.5 h-3.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M8 7V4a1 1 0 011-1h6a1 1 0 011 1v3" />
          </svg>
          <span>O'chirish</span>
        </button>
      </div>
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