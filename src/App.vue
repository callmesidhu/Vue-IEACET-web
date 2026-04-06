<script setup lang="ts">
import { RouterView } from 'vue-router'
import Layout from './components/Layout.vue'
</script>

<template>
  <Layout>
    <router-view v-slot="{ Component, route }">
      <transition
        name="fade-slide"
        mode="out-in"
      >
        <component :is="Component" :key="route.path" />
      </transition>
    </router-view>
  </Layout>
</template>

<style>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.4s ease-out;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
