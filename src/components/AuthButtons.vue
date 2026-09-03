<script setup>
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
</script>

<template>
  <div
      v-if="!auth.isAuthenticated"
      class="
      fixed
      top-4
      right-3
      z-40
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
        bg-black/20
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
</template>