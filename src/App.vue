<script setup>
import { RouterView } from 'vue-router'
</script>

<template>
  <div>
  <header>
  <button v-if="$route.name !== 'Start'" @click="$router.push('/')">
    <img src="/img/HomeButton.png" alt="home"/>
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
  z-index: 100;
  top: 0; 
  right: 87%; 
  width: 17%; 
  height: 17%; 
}

button img {
  width: 100%; 
  height: 100%;
  object-fit: contain; 
}
@media (max-width: 480px) {
  button {
    right: 75%; 
    width: 30%;
    height: 30%; 
    top: -7%;
  }
}
</style>
