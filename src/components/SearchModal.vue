<script setup>
import { ref, watch, onMounted } from 'vue'
import { debounce } from '../utils/debounce'
import { listMovies } from '../services/movie'
import { listCategories } from '../services/category'

const props = defineProps({ modelValue: Boolean })
const emit = defineEmits(['update:modelValue'])

const query = ref('')
const results = ref([])
const loading = ref(false)
const categories = ref([])
const activeCategoryId = ref(null)

const search = debounce(async (value, categoryId) => {
  if (value.trim().length < 3 && !categoryId) {
    results.value = []
    return
  }
  loading.value = true
  try {
    const { data } = await listMovies(0, 20, {
      value: value.trim().length >= 3 ? value : null,
      categoryId,
    }, null)
    results.value = data.content
  } finally {
    loading.value = false
  }
}, 1000)

watch([query, activeCategoryId], ([value, categoryId]) => search(value, categoryId))

const selectCategory = (id) => {
  activeCategoryId.value = activeCategoryId.value === id ? null : id
}

onMounted(async () => {
  try {
    const { data } = await listCategories()
    categories.value = data
  } catch {}
})

const close = () => {
  emit('update:modelValue', false)
  query.value = ''
  results.value = []
  activeCategoryId.value = null
}
</script>

<template>
  <div v-if="modelValue" @click.self="close" class="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-start justify-center pt-12 sm:pt-24 px-2 sm:px-4">
    <div class="bg-slate-900 border border-white/10 rounded-xl sm:rounded-2xl w-full max-w-2xl p-3 sm:p-5 shadow-2xl">
      <div class="flex items-center gap-2 sm:gap-3">
        <input
            v-model="query"
            autofocus
            placeholder="Kino nomini kiriting..."
            class="flex-1 bg-white/10 border border-white/20 text-white placeholder-white/40 p-2 sm:p-3 rounded-lg text-sm outline-none focus:border-purple-400 transition"
        />
        <button @click="close" class="text-white/60 hover:text-white text-lg sm:text-xl shrink-0">✕</button>
      </div>

      <div v-if="categories.length" class="flex gap-1.5 sm:gap-2 flex-wrap mt-3 sm:mt-4">
        <button
            v-for="c in categories"
            :key="c.id"
            @click="selectCategory(c.id)"
            class="inline-flex items-center gap-1 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-lg border transition-all duration-200 text-[11px] sm:text-xs font-medium"
            :class="activeCategoryId === c.id
            ? 'bg-gradient-to-r from-purple-600 to-purple-500 border-purple-400 text-white shadow-lg shadow-purple-500/30'
            : 'bg-white/[0.03] border-white/15 text-white/70 hover:bg-white/[0.08] hover:border-white/30 hover:text-white/90'"
        >
          <svg v-if="activeCategoryId === c.id" xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"/>
          </svg>
          <span>{{ c.name }}</span>
        </button>
      </div>

      <div class="mt-3 sm:mt-4 max-h-80 sm:max-h-96 overflow-y-auto flex flex-col gap-1.5 sm:gap-2">
        <p v-if="loading" class="text-white/40 text-xs sm:text-sm text-center py-3 sm:py-4">Qidirilmoqda...</p>

        <p v-else-if="(query.length >= 3 || activeCategoryId) && results.length === 0" class="text-white/40 text-xs sm:text-sm text-center py-3 sm:py-4">
          Hech narsa topilmadi
        </p>

        <router-link
            v-for="movie in results"
            :key="movie.id"
            :to="`/${movie.type === 'SERIES' || movie.seasons ? 'series' : 'movie'}/${movie.id}`"
            @click="close"
            class="flex items-center gap-2 p-1.5 sm:p-2 rounded-lg hover:bg-white/5 transition"
        >
          <div class="w-12 h-8 sm:w-16 sm:h-10 bg-gradient-to-br from-purple-800 to-indigo-900 rounded flex items-center justify-center text-sm sm:text-lg shrink-0 overflow-hidden">
            <img v-if="movie.imageUrl" :src="movie.imageUrl" :alt="movie.title" class="w-full h-full object-cover" />
            <span v-else>🎬</span>
          </div>
          <span class="text-white text-xs sm:text-sm truncate">{{ movie.title }}</span>
        </router-link>
      </div>
    </div>
  </div>
</template>