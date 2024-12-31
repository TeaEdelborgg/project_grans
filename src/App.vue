<script setup>
import { RouterView } from 'vue-router'
</script>

<template>
  <div>
  <header>
  <button v-if="$route.name !== 'Start'" @click="$router.push('/')">
    <img src="/img/HomeButton.png"/>
  </button>
  </header>
 <RouterView />
  </div>
</template>

<style scoped>
button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  position: absolute;
  left: 2px;
  top: 9px
}

button img {
  width: 140px; 
  height: auto;
}
</style>
