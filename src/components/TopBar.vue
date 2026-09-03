<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import SearchModal from './SearchModal.vue'

const auth = useAuthStore()
const searchOpen = ref(false)
</script>

<template>
  <header
      class="
      sticky
      top-0
      z-30
      backdrop-blur-lg
      bg-gradient-to-r
      from-purple-950/80
      via-slate-900/80
      to-indigo-950/80
      border-b
      border-white/10
    "
  >
    <div
        class="
        max-w-7xl
        mx-auto
        relative
        flex
        items-center
        px-4
        md:pl-24
        md:pr-6
        py-3
        min-h-[64px]
      "
    >

      <!-- Search -->
      <button
          @click="searchOpen = true"
          class="
          absolute
          left-1/2
          -translate-x-1/2

          flex
          items-center
          gap-3

          bg-white/5
          hover:bg-white/10
          border
          border-white/10

          text-white/40
          hover:text-white/60

          px-5
          py-2.5

          rounded-full
          transition

          w-[420px]
          max-w-[45%]
        "
      >
        <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-5 h-5 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
        >
          <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
          />
        </svg>

        <span class="text-sm">
          Kino qidirish...
        </span>
      </button>

      <!-- Auth buttons -->
      <div
          v-if="!auth.isAuthenticated"
          class="
          ml-auto
          flex
          items-center
          gap-2
        "
      >
        <router-link
            to="/login"
            class="
            text-white/70
            hover:text-white
            px-4
            py-2
            rounded-full
            transition
            whitespace-nowrap
          "
        >
          Kirish
        </router-link>

        <router-link
            to="/register"
            class="
            bg-purple-600
            hover:bg-purple-500
            text-white
            px-4
            py-2
            rounded-full
            transition
            whitespace-nowrap
          "
        >
          Ro'yxatdan o'tish
        </router-link>
      </div>

    </div>
  </header>

  <SearchModal v-model="searchOpen" />
</template>