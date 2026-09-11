<script setup>
import { ref, onMounted, watch } from 'vue'
import { listMovies, getMovie } from '../services/movie'
import { listCategories } from '../services/category'
import { listSources } from '../services/source'
import { useAuthStore } from '../stores/auth'
import MovieCard from '../components/MovieCard.vue'
import SkeletonLoader from '../components/SkeletonLoader.vue'
import MovieForm from '../components/MovieForm.vue'

const auth = useAuthStore()

const movies = ref([])
const categories = ref([])
const sources = ref([])

const loading = ref(true)
const page = ref(0)
const size = 10
const total = ref(0)

const searchValue = ref('')
const selectedCategoryId = ref(null)

const showForm = ref(false)
const editingMovie = ref(null)
const formLoading = ref(false)

const totalPages = () => Math.ceil(total.value / size)

const fetchMovies = async () => {
  loading.value = true

  try {
    const { data } = await listMovies(page.value, size, {
      value: searchValue.value || null,
      categoryId: selectedCategoryId.value,
    })

    movies.value = data.content
    total.value = data.total
  } finally {
    loading.value = false
  }
}

const fetchCategories = async () => {
  const { data } = await listCategories()
  categories.value = data
}

const fetchSources = async () => {
  const { data } = await listSources()

  sources.value = [...data].sort(
      (a, b) => a.orderNumber - b.orderNumber
  )
}

const selectCategory = (id) => {
  selectedCategoryId.value =
      selectedCategoryId.value === id ? null : id

  page.value = 0
}

const goToPage = (p) => {
  if (p < 0 || p >= totalPages()) return
  page.value = p
}

const openCreateForm = () => {
  editingMovie.value = null
  showForm.value = true
}

const openEditForm = async (movie) => {
  formLoading.value = true

  try {
    const { data } = await getMovie(movie.id)

    editingMovie.value = data
    showForm.value = true
  } finally {
    formLoading.value = false
  }
}

const closeForm = () => {
  showForm.value = false
  editingMovie.value = null
}

const handleSaved = async () => {
  closeForm()
  await fetchMovies()
}

let searchTimeout = null

watch(searchValue, () => {
  clearTimeout(searchTimeout)

  searchTimeout = setTimeout(() => {
    page.value = 0
    fetchMovies()
  }, 400)
})

watch([page, selectedCategoryId], fetchMovies)

onMounted(async () => {
  await Promise.all([
    fetchCategories(),
    fetchSources(),
    fetchMovies(),
  ])
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-950 via-slate-900 to-indigo-950 px-3 sm:px-4 md:pl-24 md:pr-10 py-6 sm:py-10">
    <div class="max-w-6xl mx-auto">

      <!-- Header -->
      <div class="flex items-center justify-between mb-4 sm:mb-6">
        <h1 class="text-2xl sm:text-3xl font-bold text-white">
          Kinolar
        </h1>

        <button
            v-if="auth.hasPermission('upsert movie')"
            @click="openCreateForm"
            class="group relative inline-flex items-center gap-2 px-4 py-2.5 rounded-xl
           bg-purple-600/90 hover:bg-purple-500
           text-white text-sm font-medium
           shadow-lg shadow-purple-900/20
           border border-purple-400/20
           transition-all duration-200
           hover:shadow-purple-500/20 hover:shadow-xl
           active:scale-95"
        >
          <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              class="w-4 h-4 transition-transform duration-200 group-hover:rotate-90"
          >
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 5v14M5 12h14"
            />
          </svg>

          <span>Kino qo‘shish</span>
        </button>
      </div>

      <!-- Search -->
      <div class="relative mb-5">
        <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-5 h-5 text-white/40 absolute left-4 top-1/2 -translate-y-1/2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
        >
          <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M21 21l-4.35-4.35m1.35-5.65a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>

        <input
            v-model="searchValue"
            type="text"
            placeholder="Kino qidirish..."
            class="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-purple-500/60 transition"
        />
      </div>

      <!-- Categories -->
      <div class="flex gap-2 flex-wrap mb-8">
        <button
            @click="selectCategory(null)"
            class="px-4 py-1.5 rounded-full text-sm transition"
            :class="
              selectedCategoryId === null
                ? 'bg-purple-600 text-white'
                : 'bg-white/5 text-white/60 hover:bg-white/10'
            "
        >
          Barchasi
        </button>

        <button
            v-for="c in categories"
            :key="c.id"
            @click="selectCategory(c.id)"
            class="px-4 py-1.5 rounded-full text-sm transition"
            :class="
              selectedCategoryId === c.id
                ? 'bg-purple-600 text-white'
                : 'bg-white/5 text-white/60 hover:bg-white/10'
            "
        >
          {{ c.name }}
        </button>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 mb-8">
        <SkeletonLoader v-for="i in 6" :key="i" />
      </div>

      <template v-else>

        <!-- Empty -->
        <div
            v-if="!movies.length"
            class="text-center py-16"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-16 h-16 mx-auto text-white/20 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 10l4.55-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.45.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <p class="text-white/40 text-sm">Kinolar topilmadi</p>
        </div>

        <!-- Grid -->
        <div
            v-else
            class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 mb-8"
        >
          <MovieCard
              v-for="movie in movies"
              :key="movie.id"
              :movie="movie"
              :can-edit="auth.hasPermission('upsert movie')"
              @edit="openEditForm"
          />
        </div>

        <!-- Pagination -->
        <div
            v-if="totalPages() > 1"
            class="flex items-center justify-center gap-2"
        >
          <button
              @click="goToPage(page - 1)"
              :disabled="page === 0"
              class="w-9 h-9 rounded-lg flex items-center justify-center text-white/70 bg-white/5 hover:bg-white/10 disabled:opacity-30 transition"
          >
            ‹
          </button>

          <button
              v-for="p in totalPages()"
              :key="p"
              @click="goToPage(p - 1)"
              class="w-9 h-9 rounded-lg text-sm transition"
              :class="
                page === p - 1
                  ? 'bg-purple-600 text-white'
                  : 'text-white/60 bg-white/5 hover:bg-white/10'
              "
          >
            {{ p }}
          </button>

          <button
              @click="goToPage(page + 1)"
              :disabled="page >= totalPages() - 1"
              class="w-9 h-9 rounded-lg flex items-center justify-center text-white/70 bg-white/5 hover:bg-white/10 disabled:opacity-30 transition"
          >
            ›
          </button>
        </div>
      </template>

    </div>

    <!-- Movie Form -->
    <MovieForm
        v-if="showForm"
        :movie="editingMovie"
        :categories="categories"
        :sources="sources"
        :loading="formLoading"
        @close="closeForm"
        @saved="handleSaved"
    />
  </div>
</template>