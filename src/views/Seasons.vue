<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { listSeasons, upsertSeason, deleteSeason } from '../services/season'

const auth = useAuthStore()
const seasons = ref([])
const loading = ref(false)
const showForm = ref(false)
const editItem = ref(null)
const form = ref({ id: null, name: '', orderNumber: 0 })

const canUpsert = auth.hasPermission('upsert season')
const canDelete = auth.hasPermission('delete season')

async function load() {
  loading.value = true
  try {
    const res = await listSeasons()
    seasons.value = res.data
  } finally {
    loading.value = false
  }
}

function openCreate() {
  editItem.value = null
  form.value = { id: null, name: '', orderNumber: 0 }
  showForm.value = true
}

function openEdit(item) {
  editItem.value = item
  form.value = { id: item.id, name: item.name, orderNumber: item.orderNumber }
  showForm.value = true
}

async function save() {
  await upsertSeason(form.value)
  showForm.value = false
  await load()
}

async function remove(item) {
  if (!confirm(`"${item.name}" mavsumni o'chirishni tasdiqlaysizmi?`)) return
  await deleteSeason(item.id)
  await load()
}

onMounted(load)
</script>

<template>
  <div class="min-h-screen bg-slate-950 text-white p-6">
    <div class="max-w-3xl mx-auto">
      <div class="flex items-center justify-between mb-8">
        <h1 class="text-2xl font-bold text-white">Mavsumlar</h1>
        <button
            v-if="canUpsert"
            @click="openCreate"
            class="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Qo'shish
        </button>
      </div>

      <!-- Form Modal -->
      <div v-if="showForm" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div class="bg-slate-800 border border-white/10 rounded-xl p-6 w-full max-w-md">
          <h2 class="text-lg font-semibold mb-4">{{ editItem ? 'Tahrirlash' : 'Yangi mavsum' }}</h2>
          <form @submit.prevent="save" class="space-y-4">
            <div>
              <label class="block text-sm text-white/70 mb-1">Nomi</label>
              <input
                  v-model="form.name"
                  type="text"
                  required
                  class="w-full bg-slate-700 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-400"
                  placeholder="Mavsum nomi"
              />
            </div>
            <div>
              <label class="block text-sm text-white/70 mb-1">Tartib raqami</label>
              <input
                  v-model.number="form.orderNumber"
                  type="number"
                  class="w-full bg-slate-700 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-400"
              />
            </div>
            <div class="flex gap-3 pt-2">
              <button type="submit" class="flex-1 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-sm font-medium transition-colors">Saqlash</button>
              <button type="button" @click="showForm = false" class="flex-1 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-sm transition-colors">Bekor qilish</button>
            </div>
          </form>
        </div>
      </div>

      <!-- List -->
      <div v-if="loading" class="text-center py-16 text-white/40">Yuklanmoqda...</div>
      <div v-else class="space-y-2">
        <div
            v-for="item in seasons"
            :key="item.id"
            class="flex items-center justify-between px-4 py-3 rounded-lg bg-white/5 border border-white/10 hover:border-purple-400/30 transition-colors"
        >
          <div class="flex items-center gap-3">
            <span class="text-xs text-white/40 font-mono w-6 text-center">{{ item.orderNumber }}</span>
            <span class="text-sm font-medium">{{ item.name }}</span>
          </div>
          <div class="flex gap-2">
            <button v-if="canUpsert" @click="openEdit(item)" class="p-1.5 rounded-md hover:bg-purple-500/20 text-purple-300 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L8 18l-4 1 1-4L16.5 3.5z" />
              </svg>
            </button>
            <button v-if="canDelete" @click="remove(item)" class="p-1.5 rounded-md hover:bg-red-500/20 text-red-400 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M8 7V4a1 1 0 011-1h6a1 1 0 011 1v3" />
              </svg>
            </button>
          </div>
        </div>
        <p v-if="!seasons.length" class="text-center py-12 text-white/30">Mavsumlar mavjud emas</p>
      </div>
    </div>
  </div>
</template>
