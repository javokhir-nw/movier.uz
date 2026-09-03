<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'

const props = defineProps({ movies: Array })
const active = ref(0)
let timer = null

const current = computed(() => props.movies?.[active.value])

const next = () => {
  if (!props.movies?.length) return
  active.value = (active.value + 1) % props.movies.length
}

const goTo = (i) => (active.value = i)

onMounted(() => {
  timer = setInterval(next, 4000)
})
onUnmounted(() => clearInterval(timer))
</script>

<template>
  <div v-if="current" class="relative h-100 md:h-130 rounded-2xl overflow-hidden">
    <transition name="fade" mode="out-in">
      <router-link :to="`/movie/${current.id}`" :key="current.id" class="absolute inset-0 flex items-end p-8"
                   :style="current.imageUrl ? { backgroundImage: `url(${current.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}"
                   :class="!current.imageUrl && 'bg-gradient-to-br from-purple-800 via-slate-800 to-indigo-900'">
        <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
        <div class="relative z-10">
          <h2 class="text-3xl md:text-4xl font-bold text-white mb-2">{{ current.title }}</h2>
          <p class="text-white/70 max-w-xl line-clamp-2">{{ current.description }}</p>
          <span class="inline-block mt-4 bg-purple-600 hover:bg-purple-500 text-white px-5 py-2 rounded-lg font-semibold transition">
            Ko'rish
          </span>
        </div>
      </router-link>
    </transition>

    <div class="absolute bottom-4 right-4 z-20 flex gap-2">
      <button v-for="(m, i) in movies" :key="m.id" @click="goTo(i)"
              class="w-2.5 h-2.5 rounded-full transition"
              :class="i === active ? 'bg-purple-400 w-6' : 'bg-white/30'">
      </button>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.5s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>