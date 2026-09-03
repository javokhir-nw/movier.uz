<script setup>
import { ref, onMounted, watch } from 'vue'
import { listSeries, getSeries } from '../services/series.js'
import { listCategories } from '../services/category.js'
import { useAuthStore } from '../stores/auth.js'
import SeriesCard from '../components/SeriesCard.vue'
import SeriesForm from '../components/SeriesForm.vue'

const auth = useAuthStore()

const seriesList = ref([])
const categories = ref([])

const loading = ref(true)
const page = ref(0)
const size = 10
const total = ref(0)

const searchValue = ref('')
const selectedCategoryId = ref(null)

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

let searchTimeout = null

watch(searchValue, () => {
  clearTimeout(searchTimeout)

  searchTimeout = setTimeout(() => {
    page.value = 0
    fetchSeries()
  }, 400)
})

watch([page, selectedCategoryId], fetchSeries)

onMounted(async () => {
  await Promise.all([
    fetchCategories(),
    fetchSeries(),
  ])
})
</script>

<template>
  <div
      class="min-h-screen bg-gradient-to-br from-purple-950 via-slate-900 to-indigo-950 px-4 md:pl-24 md:pr-10 py-10"
  >
    <div class="max-w-6xl mx-auto">

      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold text-white">
          Seriallar
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

          <span>Serial qo‘shish</span>
        </button>
      </div>

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
            placeholder="Serial qidirish..."
            class="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-purple-500/60 transition"
        />
      </div>

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

      <p
          v-if="loading"
          class="text-white/40 text-center py-10"
      >
        Yuklanmoqda...
      </p>

      <template v-else>

        <p
            v-if="!seriesList.length"
            class="text-white/40 text-center py-10"
        >
          Seriallar topilmadi
        </p>

        <div
            v-else
            class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8"
        >
          <SeriesCard
              v-for="series in seriesList"
              :key="series.id"
              :movie="series"
              :can-edit="auth.hasPermission('upsert movie')"
              @edit="openEditForm"
          />
        </div>

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

    <SeriesForm
        v-if="showForm"
        :series="editingSeries"
        :categories="categories"
        :loading="formLoading"
        @close="closeForm"
        @saved="handleSaved"
    />
  </div>
</template>