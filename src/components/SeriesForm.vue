<script setup>
import { ref, watch } from 'vue'
import { upsertSeries } from '../services/series'

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

const toggleCategory = (id) => {
  const index = form.value.categoryIds.indexOf(id)

  if (index === -1) {
    form.value.categoryIds.push(id)
  } else {
    form.value.categoryIds.splice(index, 1)
  }
}

const toggleActor = (id) => {
  const index = form.value.actorIds.indexOf(id)

  if (index === -1) {
    form.value.actorIds.push(id)
  } else {
    form.value.actorIds.splice(index, 1)
  }
}

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

      <div class="mb-6">
        <label class="block text-white/70 text-sm mb-2">
          Kategoriyalar
        </label>

        <div class="flex flex-wrap gap-2 max-h-32 overflow-y-auto styled-scroll pr-1 pb-1">
          <button
              v-for="category in categories"
              :key="category.id"
              type="button"
              @click="toggleCategory(category.id)"
              class="px-4 py-1.5 rounded-full text-xs font-semibold transition"
              :class="
                form.categoryIds.includes(category.id)
                  ? 'bg-purple-600 text-white'
                  : 'bg-white/5 text-white/60 hover:bg-white/10'
              "
          >
            {{ category.name }}
          </button>
        </div>
      </div>

      <!-- Actors -->
      <div v-if="actors?.length" class="mb-6">
        <label class="block text-white/70 text-sm mb-2">
          Aktyorlar
        </label>
        <select
            v-model="form.actorIds"
            multiple
            class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 min-h-[120px] styled-scroll"
        >
          <option
              v-for="a in actors"
              :key="a.id"
              :value="a.id"
              class="bg-slate-900 hover:bg-purple-600 mb-1 px-2 py-1.5 rounded cursor-pointer"
          >
            {{ a.name }}
          </option>
        </select>
        <p class="text-[10px] text-white/40 mt-1 pl-1">Ko'p tanlash uchun Ctrl (Mac: Cmd) tugmasini bosib turing</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <!-- Director -->
        <div>
          <label class="block text-white/70 text-sm mb-2">
            Rejissyor
          </label>
          <select
              v-model="form.directorId"
              class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
          >
            <option :value="null">Tanlanmagan</option>
            <option
                v-for="a in actors"
                :key="a.id"
                :value="a.id"
                class="bg-slate-900"
            >
              {{ a.name }}
            </option>
          </select>
        </div>

        <!-- Country -->
        <div>
          <label class="block text-white/70 text-sm mb-2">
            Mamlakat
          </label>
          <select
              v-model="form.countryId"
              class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
          >
            <option :value="null">Tanlanmagan</option>
            <option
                v-for="c in countries"
                :key="c.id"
                :value="c.id"
                class="bg-slate-900"
            >
              {{ c.name }}
            </option>
          </select>
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