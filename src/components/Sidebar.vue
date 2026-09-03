<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const mobileOpen = ref(false)
const expanded = ref(false)

const auth = useAuthStore()
const router = useRouter()

const logout = () => {
  auth.logout()
  mobileOpen.value = false
  router.push('/login')
}
</script>

<template>
  <button
      @click="mobileOpen = true"
      class="md:hidden fixed top-4 left-4 z-30 text-white text-2xl p-2"
  >
    ☰
  </button>

  <router-link
      to="/"
      class="md:hidden fixed top-4 left-16 z-30 text-white font-bold text-xl tracking-tight flex items-center gap-2"
  >
    <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
      <path stroke-linecap="round" stroke-linejoin="round" d="M4 4h16v16H4V4zm4 0v16m8-16v16M4 8h4m8 0h4M4 16h4m8 0h4" />
    </svg>
    Movier
  </router-link>

  <div
      v-if="mobileOpen"
      @click="mobileOpen = false"
      class="md:hidden fixed inset-0 bg-black/50 z-40"
  ></div>

  <aside
      @mouseenter="expanded = true"
      @mouseleave="expanded = false"
      class="
      fixed
      top-0
      left-0
      h-full
      bg-slate-900
      border-r
      border-white/10
      z-50
      transition-all
      duration-300
      flex
      flex-col
      overflow-hidden
    "
      :class="[
      mobileOpen ? 'translate-x-0' : '-translate-x-full',
      'md:translate-x-0',
      expanded ? 'w-64' : 'w-16'
    ]"
  >

    <button
        @click="mobileOpen = false"
        class="
        md:hidden
        self-end
        text-white/60
        hover:text-white
        text-xl
        p-4
      "
    >
      ✕
    </button>

    <router-link
        to="/"
        class="
        hidden
        md:flex
        items-center
        h-16
        text-white
        font-bold
        text-xl
        overflow-hidden
        whitespace-nowrap
        transition-all
        duration-300
      "
        :class="expanded ? 'justify-start px-4 gap-3' : 'justify-center'"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M4 4h16v16H4V4zm4 0v16m8-16v16M4 8h4m8 0h4M4 16h4m8 0h4" />
      </svg>

      <span v-if="expanded" class="transition-opacity duration-200">Movier</span>
    </router-link>

    <div
        class="
        flex
        flex-col
        w-full
        flex-1
        py-6
        transition-all
        duration-300
      "
        :class="expanded ? 'px-3' : 'px-2'"
    >

      <!-- AUTHENTICATED USER -->
      <template v-if="auth.isAuthenticated">
        <div
            class="
            w-full
            flex
            items-center
            transition-all
            duration-300
          "
            :class="expanded ? 'justify-start gap-3 px-2' : 'justify-center'"
        >
          <div
              class="
              w-10
              h-10
              min-w-10
              rounded-full
              bg-gradient-to-br
              from-purple-600
              to-indigo-600
              flex
              items-center
              justify-center
              text-white
              font-bold
              shrink-0
            "
          >
            {{ auth.displayName.charAt(0).toUpperCase() }}
          </div>

          <div v-if="expanded" class="min-w-0 flex flex-col overflow-hidden">
            <p class="text-white font-semibold text-sm whitespace-nowrap overflow-hidden text-ellipsis">
              {{ auth.displayName }}
            </p>

            <span
                class="inline-flex w-fit mt-1 text-xs px-2 py-0.5 rounded-full"
                :class="
                auth.user.role === 'ADMIN'
                  ? 'bg-purple-500/20 text-purple-300'
                  : 'bg-white/10 text-white/60'
              "
            >
              {{ auth.user.role }}
            </span>
          </div>
        </div>

        <div class="w-full h-px bg-white/10 my-6"></div>
      </template>

      <!-- Navigation (always visible) -->
      <nav class="flex flex-col gap-2 w-full">
        <router-link
            to="/movies"
            @click="mobileOpen = false"
            class="
            w-full
            h-10
            rounded-lg
            flex
            items-center
            transition-all
            duration-200
            text-white/70
            hover:bg-white/10
            hover:text-white
          "
            :class="expanded ? 'justify-start gap-3 px-3' : 'justify-center'"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 10l4.55-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.45.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>

          <span v-if="expanded" class="text-sm whitespace-nowrap">Kinolar</span>
        </router-link>
      </nav>
      <router-link
          to="/series"
          @click="mobileOpen = false"
          class="
    w-full
    h-10
    rounded-lg
    flex
    items-center
    transition-all
    duration-200
    text-white/70
    hover:bg-white/10
    hover:text-white
  "
          :class="expanded ? 'justify-start gap-3 px-3' : 'justify-center'"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <rect x="6" y="4" width="14" height="10" rx="1.5" stroke-linecap="round" stroke-linejoin="round" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 8v10a1.5 1.5 0 001.5 1.5H16" />
        </svg>

        <span v-if="expanded" class="text-sm whitespace-nowrap">Seriallar</span>
      </router-link>

      <!-- Logout -->
      <button
          v-if="auth.isAuthenticated"
          @click="logout"
          class="
          mt-auto
          w-full
          h-10
          rounded-lg
          flex
          items-center
          transition-all
          duration-200
          text-red-400
          hover:bg-red-500/10
          hover:text-red-300
        "
          :class="expanded ? 'justify-start gap-3 px-3' : 'justify-center'"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>

        <span v-if="expanded" class="text-sm whitespace-nowrap">Chiqish</span>
      </button>
    </div>
  </aside>
</template>