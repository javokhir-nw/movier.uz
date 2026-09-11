<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'

const props = defineProps({ movies: Array })
const active = ref(0)
const imageLoaded = ref(false)
let timer = null

const current = computed(() => props.movies?.[active.value])

const next = () => {
  if (!props.movies?.length) return
  imageLoaded.value = false
  active.value = (active.value + 1) % props.movies.length
}

const goTo = (i) => {
  imageLoaded.value = false
  active.value = i
}

const onImageLoad = () => {
  imageLoaded.value = true
}

onMounted(() => {
  timer = setInterval(next, 5000)
})
onUnmounted(() => clearInterval(timer))
</script>

<template>
  <div v-if="current" class="relative h-80 sm:h-96 md:h-[500px] rounded-xl sm:rounded-2xl overflow-hidden group">
    <transition name="fade" mode="out-in">
      <router-link :to="`/movie/${current.id}`" :key="current.id" class="absolute inset-0 flex items-end">
        <!-- Background image container -->
        <div class="absolute inset-0 bg-gradient-to-br from-purple-900/50 via-slate-900/50 to-indigo-900/50 overflow-hidden">
          <!-- Blurred background for visual depth -->
          <img
            v-if="current.imageUrl"
            :src="current.imageUrl"
            :alt="current.title"
            class="absolute inset-0 w-full h-full object-cover blur-md scale-110 opacity-50"
            loading="lazy"
          />

          <!-- Main image with fade-in effect -->
          <img
            v-if="current.imageUrl"
            :src="current.imageUrl"
            :alt="current.title"
            @load="onImageLoad"
            class="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
            :class="imageLoaded ? 'opacity-100' : 'opacity-0'"
            loading="lazy"
          />
        </div>

        <!-- Gradient overlay -->
        <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>

        <!-- Content -->
        <div class="relative z-10 p-4 sm:p-6 md:p-8 w-full">
          <h2 class="text-xl sm:text-3xl md:text-4xl font-bold text-white mb-1 sm:mb-2 line-clamp-2">{{ current.title }}</h2>
          <p class="text-white/70 max-w-xl line-clamp-2 text-xs sm:text-sm md:text-base mb-3 sm:mb-4">{{ current.description }}</p>
          <span class="inline-block bg-purple-600 hover:bg-purple-500 text-white px-4 sm:px-5 py-1.5 sm:py-2 rounded-lg font-semibold transition text-sm">
            Ko'rish
          </span>
        </div>
      </router-link>
    </transition>

    <!-- Dot indicators -->
    <div class="absolute bottom-3 sm:bottom-4 right-3 sm:right-4 z-20 flex gap-1.5 sm:gap-2">
      <button
        v-for="(m, i) in movies"
        :key="m.id"
        @click="goTo(i)"
        class="h-1.5 rounded-full transition-all duration-300"
        :class="i === active ? 'bg-purple-400 w-6 sm:w-8' : 'bg-white/30 w-1.5 hover:bg-white/50'"
        :aria-label="`Go to slide ${i + 1}`"
      />
    </div>

    <!-- Next button hint (desktop only) -->
    <div class="absolute inset-y-0 right-0 z-10 hidden md:flex items-center justify-end pr-4 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      <div class="text-white/40 text-sm">Next in 5s</div>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.5s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>