<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const expanded = ref(false)

const auth = useAuthStore()
const router = useRouter()

const logout = () => {
  auth.logout()
  router.push('/login')
}
</script>

<template>
  <aside
      @mouseenter="expanded = true"
      @mouseleave="expanded = false"
      class="
      hidden
      md:flex
      fixed
      top-0
      left-0
      h-full
      bg-slate-900
      border-r
      border-white/10
      z-40
      transition-all
      duration-300
      flex-col
      overflow-hidden
    "
      :class="expanded ? 'w-64' : 'w-16'"
  >

    <router-link
        to="/"
        class="
        flex
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
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 10l4.55-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.45.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
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
      <nav class="flex flex-col gap-2 w-full flex-1 overflow-y-auto overflow-x-hidden styled-scroll pr-1 pb-4">
        <router-link
            to="/movies"
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

        <router-link
            to="/series"
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

        <template v-if="auth.isAuthenticated && auth.hasAnyPermission(['upsert category','upsert source','upsert season','upsert actor','upsert country'])">
          <div class="w-full h-px bg-white/10 my-4"></div>
          <div v-if="expanded" class="px-3 mb-2">
            <span class="text-[10px] font-bold text-white/40 uppercase tracking-wider">Boshqaruv</span>
          </div>

          <router-link
              v-if="auth.hasPermission('upsert actor')"
              to="/actors"
              class="w-full h-10 rounded-lg flex items-center transition-all duration-200 text-purple-300/70 hover:bg-purple-500/10 hover:text-purple-300"
              :class="expanded ? 'justify-start gap-3 px-3' : 'justify-center'"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            <span v-if="expanded" class="text-sm whitespace-nowrap">Aktorlar</span>
          </router-link>

          <router-link
              v-if="auth.hasPermission('upsert category')"
              to="/categories"
              class="w-full h-10 rounded-lg flex items-center transition-all duration-200 text-purple-300/70 hover:bg-purple-500/10 hover:text-purple-300"
              :class="expanded ? 'justify-start gap-3 px-3' : 'justify-center'"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            <span v-if="expanded" class="text-sm whitespace-nowrap">Kategoriyalar</span>
          </router-link>

          <router-link
              v-if="auth.hasPermission('upsert country')"
              to="/countries"
              class="w-full h-10 rounded-lg flex items-center transition-all duration-200 text-purple-300/70 hover:bg-purple-500/10 hover:text-purple-300"
              :class="expanded ? 'justify-start gap-3 px-3' : 'justify-center'"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span v-if="expanded" class="text-sm whitespace-nowrap">Mamlakatlar</span>
          </router-link>

          <router-link
              v-if="auth.hasPermission('upsert source')"
              to="/sources"
              class="w-full h-10 rounded-lg flex items-center transition-all duration-200 text-purple-300/70 hover:bg-purple-500/10 hover:text-purple-300"
              :class="expanded ? 'justify-start gap-3 px-3' : 'justify-center'"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            <span v-if="expanded" class="text-sm whitespace-nowrap">Manbalar</span>
          </router-link>

          <router-link
              v-if="auth.hasPermission('upsert season')"
              to="/seasons"
              class="w-full h-10 rounded-lg flex items-center transition-all duration-200 text-purple-300/70 hover:bg-purple-500/10 hover:text-purple-300"
              :class="expanded ? 'justify-start gap-3 px-3' : 'justify-center'"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <span v-if="expanded" class="text-sm whitespace-nowrap">Mavsumlar</span>
          </router-link>
        </template>
      </nav>

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