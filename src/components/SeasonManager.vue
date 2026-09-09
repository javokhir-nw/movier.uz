<script setup>
import { ref, computed, onMounted } from 'vue'
import { listSeasons } from '../services/season'
import { upsertMovieSeason } from '../services/movieSeason'

const props = defineProps({
  seriesId: {
    type: String,
    required: true,
  },
  seasons: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['close', 'saved'])

const allSeasons = ref([])
const selectedSeasonId = ref(null)
const loading = ref(false)
const saving = ref(false)
const error = ref('')

const availableSeasons = computed(() => {
  return allSeasons.value.filter(season => {
    // Only check seasonId - that's the actual season reference
    return !props.seasons.some(s => s.seasonId === season.id)
  })
})

const loadSeasons = async () => {
  try {
    loading.value = true
    const { data } = await listSeasons()
    allSeasons.value = data
  } catch (e) {
    error.value = 'Fasllar yuklanishda xatolik'
  } finally {
    loading.value = false
  }
}

const addSeason = async () => {
  error.value = ''

  if (!selectedSeasonId.value) {
    error.value = 'Fasl tanlang'
    return
  }

  saving.value = true

  try {
    await upsertMovieSeason({
      id: null,
      seasonId: selectedSeasonId.value,
      seriesId: props.seriesId,
    })

    emit('saved')
  } catch (e) {
    error.value =
      e.response?.data?.message ||
      'Fasl qo\'shishda xatolik yuz berdi'
  } finally {
    saving.value = false
  }
}

onMounted(loadSeasons)
</script>

<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
    @click.self="emit('close')"
  >
    <div
      class="w-full max-w-md bg-slate-900 border border-white/10 rounded-2xl shadow-2xl p-6"
    >
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-bold text-white">Fasl qo'shish</h2>
        <button
          @click="emit('close')"
          class="text-white/50 hover:text-white text-2xl"
        >
          ×
        </button>
      </div>

      <div v-if="error" class="mb-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3">
        {{ error }}
      </div>

      <div v-if="loading" class="text-white/40 text-center py-4">
        Yuklanmoqda...
      </div>

      <div v-else-if="!availableSeasons.length" class="text-white/40 text-center py-4">
        Barcha fasllar allaqachon qo'shilgan
      </div>

      <div v-else class="mb-6">
        <label class="block text-white/70 text-sm mb-3">
          Fasl tanlang
        </label>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="season in availableSeasons"
            :key="season.id"
            type="button"
            @click="selectedSeasonId = season.id"
            class="px-4 py-2 rounded-lg text-sm transition"
            :class="
              selectedSeasonId === season.id
                ? 'bg-purple-600 text-white border border-purple-400'
                : 'bg-white/5 text-white/60 hover:bg-white/10 border border-white/10'
            "
          >
            {{ season.name }}
          </button>
        </div>
      </div>

      <div class="flex justify-end gap-3">
        <button
          type="button"
          @click="emit('close')"
          class="px-5 py-2.5 rounded-xl bg-white/5 text-white/70 hover:bg-white/10 transition"
        >
          Bekor qilish
        </button>
        <button
          v-if="availableSeasons.length"
          type="button"
          :disabled="saving || !selectedSeasonId"
          @click="addSeason"
          class="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white transition"
        >
          {{ saving ? 'Qo\'shilyapti...' : 'Qo\'shish' }}
        </button>
      </div>
    </div>
  </div>
</template>
