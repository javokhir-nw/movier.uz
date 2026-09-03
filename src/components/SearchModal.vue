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
    })
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
  <div v-if="modelValue" @click.self="close" class="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-start justify-center pt-24 px-4">
    <div class="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-2xl p-5 shadow-2xl">
      <div class="flex items-center gap-3">
        <input
            v-model="query"
            autofocus
            placeholder="Kino nomini kiriting..."
            class="flex-1 bg-white/10 border border-white/20 text-white placeholder-white/40 p-3 rounded-lg outline-none focus:border-purple-400 transition"
        />
        <button @click="close" class="text-white/60 hover:text-white text-xl">✕</button>
      </div>

      <div v-if="categories.length" class="flex gap-2 flex-wrap mt-3">
        <button
            v-for="c in categories"
            :key="c.id"
            @click="selectCategory(c.id)"
            class="text-xs px-3 py-1.5 rounded-full border transition"
            :class="activeCategoryId === c.id
            ? 'bg-purple-600 border-purple-500 text-white'
            : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'"
        >
          {{ c.name }}
        </button>
      </div>

      <div class="mt-4 max-h-96 overflow-y-auto flex flex-col gap-2">
        <p v-if="loading" class="text-white/40 text-sm text-center py-4">Qidirilmoqda...</p>

        <p v-else-if="(query.length >= 3 || activeCategoryId) && results.length === 0" class="text-white/40 text-sm text-center py-4">
          Hech narsa topilmadi
        </p>

        <router-link
            v-for="movie in results"
            :key="movie.id"
            :to="`/movie/${movie.id}`"
            @click="close"
            class="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition"
        >
          <div class="w-16 h-10 bg-gradient-to-br from-purple-800 to-indigo-900 rounded flex items-center justify-center text-lg shrink-0 overflow-hidden">
            <img v-if="movie.imageUrl" :src="movie.imageUrl" :alt="movie.title" class="w-full h-full object-cover" />
            <span v-else>🎬</span>
          </div>
          <span class="text-white truncate">{{ movie.title }}</span>
        </router-link>
      </div>
    </div>
  </div>
</template>