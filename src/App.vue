<template>
  <Sidebar />
  <TopBar />
  <router-view />
</template>

<script setup>
import Sidebar from './components/Sidebar.vue'
import TopBar from './components/TopBar.vue'
</script>