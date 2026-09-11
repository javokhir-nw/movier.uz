<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import SearchModal from './SearchModal.vue'

const auth = useAuthStore()
const searchOpen = ref(false)
const mobileMenuOpen = ref(false)
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
        px-3
        sm:px-4
        md:pl-24
        md:pr-6
        py-2
        sm:py-3
        min-h-[56px]
        sm:min-h-[64px]
      "
    >

      <!-- Mobile menu button -->
      <button
          @click="mobileMenuOpen = !mobileMenuOpen"
          class="md:hidden text-white/70 hover:text-white transition p-1.5 -ml-1.5"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <!-- Mobile logo -->
      <router-link
          to="/"
          class="md:hidden text-white font-bold text-sm ml-2 flex items-center gap-1.5 flex-1"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 10l4.55-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.45.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
        <span class="hidden sm:inline">Movier</span>
      </router-link>

      <!-- Desktop Search -->
      <button
          @click="searchOpen = true"
          class="
          hidden
          md:flex
          absolute
          left-1/2
          -translate-x-1/2
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

      <!-- Mobile Search Button -->
      <button
          @click="searchOpen = true"
          class="
          md:hidden
          text-white/70
          hover:text-white
          transition
          p-1.5
          -mr-1.5
        "
      >
        <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-5 h-5"
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
      </button>

      <!-- Desktop Auth buttons -->
      <div
          v-if="!auth.isAuthenticated"
          class="
          hidden
          md:flex
          ml-auto
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

    <!-- Mobile dropdown menu -->
    <div
        v-if="mobileMenuOpen"
        class="md:hidden border-t border-white/10 bg-slate-900/50 backdrop-blur"
    >
      <div class="px-3 py-3 flex flex-col gap-2">
        <router-link
            to="/movies"
            @click="mobileMenuOpen = false"
            class="text-white/70 hover:text-white hover:bg-white/5 px-3 py-2 rounded-lg transition text-sm"
        >
          Kinolar
        </router-link>

        <router-link
            to="/series"
            @click="mobileMenuOpen = false"
            class="text-white/70 hover:text-white hover:bg-white/5 px-3 py-2 rounded-lg transition text-sm"
        >
          Seriallar
        </router-link>

        <div v-if="!auth.isAuthenticated" class="flex flex-col gap-2 pt-2 border-t border-white/10">
          <router-link
              to="/login"
              @click="mobileMenuOpen = false"
              class="text-white/70 hover:text-white px-3 py-2 rounded-lg transition text-sm"
          >
            Kirish
          </router-link>

          <router-link
              to="/register"
              @click="mobileMenuOpen = false"
              class="bg-purple-600 hover:bg-purple-500 text-white px-3 py-2 rounded-lg transition text-sm text-center"
          >
            Ro'yxatdan o'tish
          </router-link>
        </div>
      </div>
    </div>
  </header>

  <SearchModal v-model="searchOpen" />
</template>