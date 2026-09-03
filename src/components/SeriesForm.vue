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
})

const resetForm = () => {
  if (props.series) {
    form.value = {
      id: props.series.id ?? null,
      title: props.series.title ?? '',
      description: props.series.description ?? '',
      imageUrl: props.series.imageUrl ?? '',

      categoryIds: props.series.categoryIds
          ? [...props.series.categoryIds]
          : (props.series.categories ?? []).map(category => category.id),
    }

    return
  }

  form.value = {
    id: null,
    title: '',
    description: '',
    imageUrl: '',
    categoryIds: [],
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