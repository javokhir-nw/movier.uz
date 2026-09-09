<script setup>
import { ref, watch } from 'vue'
import { upsertEpisode } from '../services/episode'

const props = defineProps({
  seriesId: {
    type: String,
    required: true,
  },
  seasonId: {
    type: [String, Number],
    default: null,
  },
  sources: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['close', 'saved'])

const saving = ref(false)
const error = ref('')

const form = ref({
  orderNumber: 1,
  sources: [],
})

const resetForm = () => {
  form.value = {
    orderNumber: 1,
    sources: props.sources.length
      ? [{ url: '', sourceId: props.sources[0]?.id ?? null }]
      : [],
  }
}

watch(() => props.sources, resetForm, { immediate: true })

const addSource = () => {
  form.value.sources.push({
    url: '',
    sourceId: props.sources[0]?.id ?? null,
  })
}

const removeSource = (index) => {
  form.value.sources.splice(index, 1)
}

const submit = async () => {
  error.value = ''

  if (!form.value.orderNumber) {
    error.value = 'Qism raqami kiriting'
    return
  }

  const validSources = form.value.sources.filter(
    source => source.url.trim() && source.sourceId
  )

  if (!validSources.length) {
    error.value = 'Kamida bitta source kiriting'
    return
  }

  saving.value = true

  try {
    await upsertEpisode({
      id: null,
      orderNumber: form.value.orderNumber,
      type: 'EPISODE',
      sources: validSources.map(source => ({
        url: source.url.trim(),
        sourceId: source.sourceId,
      })),
      ...(props.seasonId
        ? { movieSeasonId: props.seasonId }
        : { parentMovieId: props.seriesId }),
    })

    emit('saved')
  } catch (e) {
    error.value =
      e.response?.data?.message ||
      'Qism qo\'shishda xatolik yuz berdi'
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
    @click.self="emit('close')"
  >
    <div
      class="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-900 border border-white/10 rounded-2xl shadow-2xl p-6"
    >
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-bold text-white">Qism qo'shish</h2>
        <button
          @click="emit('close')"
          class="text-white/50 hover:text-white text-2xl"
        >
          ×
        </button>
      </div>

      <div
        v-if="error"
        class="mb-5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3"
      >
        {{ error }}
      </div>

      <!-- Episode Number -->
      <div class="mb-4">
        <label class="block text-white/70 text-sm mb-2">
          Qism raqami
        </label>
        <input
          v-model.number="form.orderNumber"
          type="number"
          min="1"
          class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
          placeholder="1"
        />
      </div>

      <!-- Sources -->
      <div class="mb-6">
        <div class="flex items-center justify-between mb-3">
          <label class="text-white/70 text-sm">Video manbalari</label>
          <button
            type="button"
            @click="addSource"
            class="text-sm text-purple-400 hover:text-purple-300"
          >
            + Source qo'shish
          </button>
        </div>

        <div
          v-for="(source, index) in form.sources"
          :key="index"
          class="flex gap-2 mb-3"
        >
          <select
            v-model="source.sourceId"
            class="w-32 bg-slate-800 border border-white/10 rounded-xl px-3 py-3 text-white focus:outline-none focus:border-purple-500"
          >
            <option
              v-for="item in sources"
              :key="item.id"
              :value="item.id"
            >
              {{ item.name }}
            </option>
          </select>

          <input
            v-model="source.url"
            type="url"
            class="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
            placeholder="Video URL"
          />

          <button
            v-if="form.sources.length > 1"
            type="button"
            @click="removeSource(index)"
            class="px-3 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20"
          >
            ×
          </button>
        </div>
      </div>

      <!-- Buttons -->
      <div class="flex justify-end gap-3">
        <button
          type="button"
          @click="emit('close')"
          class="px-5 py-2.5 rounded-xl bg-white/5 text-white/70 hover:bg-white/10 transition"
        >
          Bekor qilish
        </button>

        <button
          type="button"
          :disabled="saving || loading"
          @click="submit"
          class="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white transition"
        >
          {{ saving ? 'Qo\'shilyapti...' : 'Qo\'shish' }}
        </button>
      </div>
    </div>
  </div>
</template>
