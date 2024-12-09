<script setup>
import { RouterView } from 'vue-router'
</script>

<template>
  <div>
  <header>
  <button v-if="$route.name !== 'Start'" @click="$router.push('/')">
      Home
  </button>
  </header>
 <RouterView />
  </div>
</template>

<style>

</style>
