<script setup>
import { ref, watch } from 'vue'
import { upsertMovie } from '../services/movie'

const props = defineProps({
  movie: {
    type: Object,
    default: null,
  },

  categories: {
    type: Array,
    default: () => [],
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
  sources: [],
})

const createEmptySource = () => ({
  url: '',
  sourceId: props.sources[0]?.id ?? null,
})

const resetForm = () => {
  if (props.movie) {
    form.value = {
      id: props.movie.id ?? null,
      title: props.movie.title ?? '',
      description: props.movie.description ?? '',
      imageUrl: props.movie.imageUrl ?? '',

      categoryIds: props.movie.categoryIds
          ? [...props.movie.categoryIds]
          : (props.movie.categories ?? []).map(category => category.id),

      sources: props.movie.sources
          ? props.movie.sources.map(source => ({
            url: source.url ?? '',
            sourceId: source.sourceId ?? null,
          }))
          : [],
    }

    return
  }

  form.value = {
    id: null,
    title: '',
    description: '',
    imageUrl: '',
    categoryIds: [],
    sources: props.sources.length
        ? [createEmptySource()]
        : [],
  }
}

watch(
    () => props.movie,
    resetForm,
    {
      immediate: true,
    }
)

const addSource = () => {
  form.value.sources.push(createEmptySource())
}

const removeSource = (index) => {
  form.value.sources.splice(index, 1)
}

const toggleCategory = (id) => {
  const index = form.value.categoryIds.indexOf(id)

  if (index === -1) {
    form.value.categoryIds.push(id)
  } else {
    form.value.categoryIds.splice(index, 1)
  }
}

const submit = async () => {
  error.value = ''

  if (!form.value.title.trim()) {
    error.value = 'Kino nomini kiriting'
    return
  }

  if (!form.value.categoryIds.length) {
    error.value = 'Kamida bitta kategoriya tanlang'
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
    await upsertMovie({
      id: form.value.id,
      title: form.value.title.trim(),
      description: form.value.description.trim(),
      imageUrl: form.value.imageUrl.trim(),
      categoryIds: form.value.categoryIds,
      type: 'MOVIE',
      sources: validSources.map(source => ({
        url: source.url.trim(),
        sourceId: source.sourceId,
      })),
    })

    emit('saved')
  } catch (e) {
    error.value =
        e.response?.data?.message ||
        'Kino saqlashda xatolik yuz berdi'
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
        class="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-slate-900 border border-white/10 rounded-2xl shadow-2xl p-6"
    >

      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-bold text-white">
          {{ form.id ? 'Kino tahrirlash' : 'Kino qo‘shish' }}
        </h2>

        <button
            @click="emit('close')"
            class="text-white/50 hover:text-white text-2xl"
        >
          ×
        </button>
      </div>

      <!-- Error -->
      <div
          v-if="error"
          class="mb-5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3"
      >
        {{ error }}
      </div>

      <!-- Title -->
      <div class="mb-4">
        <label class="block text-white/70 text-sm mb-2">
          Kino nomi
        </label>

        <input
            v-model="form.title"
            type="text"
            class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
            placeholder="Kino nomi"
        />
      </div>

      <!-- Description -->
      <div class="mb-4">
        <label class="block text-white/70 text-sm mb-2">
          Tavsif
        </label>

        <textarea
            v-model="form.description"
            rows="5"
            class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white resize-none focus:outline-none focus:border-purple-500"
            placeholder="Kino haqida..."
        />
      </div>

      <!-- Image -->
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

      <!-- Categories -->
      <div class="mb-6">
        <label class="block text-white/70 text-sm mb-2">
          Kategoriyalar
        </label>

        <div class="flex flex-wrap gap-2">
          <button
              v-for="category in categories"
              :key="category.id"
              type="button"
              @click="toggleCategory(category.id)"
              class="px-4 py-2 rounded-full text-sm transition"
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

      <!-- Sources -->
      <div class="mb-6">
        <div class="flex items-center justify-between mb-3">
          <label class="text-white/70 text-sm">
            Video manbalari
          </label>

          <button
              type="button"
              @click="addSource"
              class="text-sm text-purple-400 hover:text-purple-300"
          >
            + Source qo‘shish
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
          {{ saving ? 'Saqlanmoqda...' : 'Saqlash' }}
        </button>
      </div>

    </div>
  </div>
</template>