<script setup>
import { ref, watch } from 'vue'
import { upsertSeries } from '../services/series'
import SearchableSelect from './SearchableSelect.vue'

const props = defineProps({
  series: {
    type: Object,
    default: null,
  },

  categories: {
    type: Array,
    default: () => [],
  },

  actors: {
    type: Array,
    default: () => [],
  },

  countries: {
    type: Array,
    default: () => [],
  },

  loading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits([
  'close',
  'saved',
])

const saving = ref(false)
const error = ref('')

const form = ref({
  id: null,
  title: '',
  description: '',
  imageUrl: '',
  categoryIds: [],
  actorIds: [],
  directorId: null,
  countryId: null,
})

const resetForm = () => {
  if (props.series) {
    form.value = {
      id: props.series.id ?? null,
      title: props.series.title ?? '',
      description: props.series.description ?? '',
      imageUrl: props.series.imageUrl ?? '',

      categoryIds: props.series.categories
          ? props.series.categories.map(category => category.id)
          : [],

      actorIds: props.series.actors
          ? props.series.actors.map(actor => actor.id)
          : [],

      directorId: props.series.director?.id ?? null,
      countryId: props.series.country?.id ?? null,
    }

    return
  }

  form.value = {
    id: null,
    title: '',
    description: '',
    imageUrl: '',
    categoryIds: [],
    actorIds: [],
    directorId: null,
    countryId: null,
  }
}

watch(
    () => props.series,
    resetForm,
    {
      immediate: true,
    }
)



const submit = async () => {
  error.value = ''

  if (!form.value.title.trim()) {
    error.value = 'Serial nomini kiriting'
    return
  }

  if (!form.value.categoryIds.length) {
    error.value = 'Kamida bitta kategoriya tanlang'
    return
  }

  saving.value = true

  try {
    await upsertSeries({
      id: form.value.id,
      title: form.value.title.trim(),
      description: form.value.description.trim(),
      imageUrl: form.value.imageUrl.trim(),
      categoryIds: form.value.categoryIds,
      actorIds: form.value.actorIds.length ? form.value.actorIds : null,
      directorId: form.value.directorId,
      countryId: form.value.countryId,
      type: 'SERIES',
    })

    emit('saved')
  } catch (e) {
    error.value =
        e.response?.data?.message ||
        'Serial saqlashda xatolik yuz berdi'
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
        <h2 class="text-xl font-bold text-white">
          {{ form.id ? 'Serial tahrirlash' : 'Serial qo‘shish' }}
        </h2>

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

      <div class="mb-4">
        <label class="block text-white/70 text-sm mb-2">
          Serial nomi
        </label>

        <input
            v-model="form.title"
            type="text"
            class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
            placeholder="Serial nomi"
        />
      </div>

      <div class="mb-4">
        <label class="block text-white/70 text-sm mb-2">
          Tavsif
        </label>

        <textarea
            v-model="form.description"
            rows="5"
            class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white resize-none focus:outline-none focus:border-purple-500"
            placeholder="Serial haqida..."
        />
      </div>

      <div class="mb-5">
        <label class="block text-white/70 text-sm mb-2">
          Rasm URL
        </label>

        <input
            v-model="form.imageUrl"
            type="url"
            class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
            placeholder="https://..."
        />
      </div>

      <!-- Lists in Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <!-- Categories -->
        <div>
          <label class="block text-white/70 text-sm mb-2">Kategoriyalar</label>
          <SearchableSelect 
            v-model="form.categoryIds" 
            :options="categories" 
            :multiple="true" 
            placeholder="Kategoriya tanlang" 
          />
        </div>

        <!-- Country -->
        <div>
          <label class="block text-white/70 text-sm mb-2">Mamlakat</label>
          <SearchableSelect 
            v-model="form.countryId" 
            :options="countries" 
            placeholder="Davlat tanlang" 
          />
        </div>
        
        <!-- Director -->
        <div>
          <label class="block text-white/70 text-sm mb-2">Rejissyor</label>
          <SearchableSelect 
            v-model="form.directorId" 
            :options="actors" 
            placeholder="Rejissyor tanlang" 
          />
        </div>

        <!-- Actors -->
        <div>
          <label class="block text-white/70 text-sm mb-2">Aktyorlar</label>
          <SearchableSelect 
            v-model="form.actorIds" 
            :options="actors" 
            :multiple="true" 
            placeholder="Aktyor tanlang" 
          />
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
            type="button"
            :disabled="saving || loading"
            @click="submit"
            class="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white transition"
        >
          {{ saving ? 'Saqlanmoqda...' : 'Saqlash' }}
        </button>
      </div>

    </div>
  </div>
</template>