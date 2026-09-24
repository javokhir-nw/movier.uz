<script setup>
import { ref, onMounted, watch } from 'vue'
import { listSeries, getSeries, deleteSeries } from '../services/series'
import { listCategories } from '../services/category'
import { listActors } from '../services/actor'
import { listCountries } from '../services/country'
import { useAuthStore } from '../stores/auth'
import SeriesCard from '../components/SeriesCard.vue'
import SkeletonLoader from '../components/SkeletonLoader.vue'
import SeriesForm from '../components/SeriesForm.vue'
import SearchableSelect from '../components/SearchableSelect.vue'

const auth = useAuthStore()

const seriesList = ref([])
const categories = ref([])
const actors = ref([])
const countries = ref([])

const loading = ref(true)
const page = ref(0)
const size = 10
const total = ref(0)

const searchValue = ref('')
const selectedCategoryId = ref(null)
const selectedCountryId = ref(null)

const showForm = ref(false)
const editingSeries = ref(null)
const formLoading = ref(false)

const totalPages = () => Math.ceil(total.value / size)

const fetchSeries = async () => {
  loading.value = true
  try {
    const { data } = await listSeries(page.value, size, {
      value: searchValue.value || null,
      categoryId: selectedCategoryId.value,
      countryId: selectedCountryId.value,
    })
    seriesList.value = data.content
    total.value = data.total
  } finally {
    loading.value = false
  }
}

const fetchCategories = async () => {
  const { data } = await listCategories()
  categories.value = data
}

const fetchActors = async () => {
  const { data } = await listActors()
  actors.value = data
}

const fetchCountries = async () => {
  const { data } = await listCountries()
  countries.value = data
}

const selectCategory = (id) => {
  selectedCategoryId.value = selectedCategoryId.value === id ? null : id
  page.value = 0
}

const goToPage = (p) => {
  if (p < 0 || p >= totalPages()) return
  page.value = p
}

const openCreateForm = () => {
  editingSeries.value = null
  showForm.value = true
}

const openEditForm = async (series) => {
  formLoading.value = true
  try {
    const { data } = await getSeries(series.id)
    editingSeries.value = data
    showForm.value = true
  } finally {
    formLoading.value = false
  }
}

const closeForm = () => {
  showForm.value = false
  editingSeries.value = null
}

const handleSaved = async () => {
  closeForm()
  await fetchSeries()
}

const removeSeries = async (series) => {
  if (!confirm(`"${series.title}" serialni o'chirishni tasdiqlaysizmi?`)) return
  try {
    await deleteSeries(series.id)
    await fetchSeries()
  } catch (err) {
    console.error(err)
  }
}

let searchTimeout = null
watch(searchValue, () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    page.value = 0
    fetchSeries()
  }, 400)
})

const onFilterChange = () => {
  page.value = 0
  fetchSeries()
}

watch([page], fetchSeries)

onMounted(async () => {
  await Promise.all([
    fetchCategories(),
    fetchActors(),
    fetchCountries(),
    fetchSeries(),
  ])
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-950 via-slate-900 to-indigo-950 px-3 sm:px-4 md:pl-24 md:pr-10 py-6 sm:py-10">
    <div class="max-w-6xl mx-auto">
      <div class="flex items-center justify-between mb-4 sm:mb-6">
        <h1 class="text-2xl sm:text-3xl font-bold text-white">
          Seriallar
        </h1>
        <button
            v-if="auth.hasPermission('upsert movie')"
            @click="openCreateForm"
            class="group relative inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600/90 hover:bg-purple-500 text-white text-sm font-medium shadow-lg shadow-purple-900/20 border border-purple-400/20 transition-all duration-200 hover:shadow-purple-500/20 hover:shadow-xl active:scale-95"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-4 h-4 transition-transform duration-200 group-hover:rotate-90">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 5v14M5 12h14" />
          </svg>
          <span>Serial qo‘shish</span>
        </button>
      </div>

      <div class="relative mb-5">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-white/40 absolute left-4 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35m1.35-5.65a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
            v-model="searchValue"
            type="text"
            placeholder="Serial qidirish..."
            class="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-purple-500/60 transition"
        />
      </div>

      <!-- Filters: Categories & Countries -->
      <div class="flex flex-col sm:flex-row gap-4 mb-8">
        
        <!-- Category Select -->
        <div class="relative flex-1 group z-20">
          <SearchableSelect
            v-model="selectedCategoryId"
            :options="categories"
            placeholder="Barcha kategoriyalar"
            @change="onFilterChange"
          >
            <template #icon>
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </template>
          </SearchableSelect>
        </div>

        <!-- Country Select -->
        <div class="relative flex-1 group z-10">
          <SearchableSelect
            v-model="selectedCountryId"
            :options="countries"
            placeholder="Barcha davlatlar"
            @change="onFilterChange"
          >
            <template #icon>
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </template>
          </SearchableSelect>
        </div>

      </div>

      <p v-if="loading" class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 mb-8">
        <SkeletonLoader v-for="i in 6" :key="i" />
      </p>

      <template v-else>
        <div v-if="!seriesList.length" class="text-center py-16">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-16 h-16 mx-auto text-white/20 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <rect x="6" y="4" width="14" height="10" rx="1.5" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 8v10a1.5 1.5 0 001.5 1.5H16" />
          </svg>
          <p class="text-white/40 text-sm">Seriallar topilmadi</p>
        </div>

        <div v-else class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 mb-8">
          <SeriesCard
              v-for="series in seriesList"
              :key="series.id"
              :movie="series"
              :can-edit="auth.hasPermission('upsert movie')"
              :can-delete="auth.hasPermission('delete movie')"
              @edit="openEditForm"
              @delete="removeSeries"
          />
        </div>

        <!-- Pagination -->
        <div v-if="totalPages() > 1" class="flex items-center justify-center gap-2">
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
              :class="page === p - 1 ? 'bg-purple-600 text-white' : 'text-white/60 bg-white/5 hover:bg-white/10'"
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

    <SeriesForm
        v-if="showForm"
        :series="editingSeries"
        :categories="categories"
        :actors="actors"
        :countries="countries"
        :loading="formLoading"
        @close="closeForm"
        @saved="handleSaved"
    />
  </div>
</template>