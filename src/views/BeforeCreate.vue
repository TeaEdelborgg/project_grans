<template>
    <div class="container">
    <router-link to="/makeQuiz/">
        <button class="makeQuizButton">{{ uiLabels.makeQuiz }}</button>
    </router-link>

    <router-link to="/selectQuiz/">
        <button class="selectQuizButton">{{ uiLabels.selectQuiz }}</button>
    </router-link>
    </div>
</template>

<script>

import io from 'socket.io-client';
//const socket = io("localhost:3000");
const socket = io(sessionStorage.getItem("dataServer")) //for mobile phones osv

export default {
  name: 'BeforeCreate',
  /*components: {
    ResponsiveNav
  },
  */
  data: function () {
    return {
      uiLabels: {},
      lang: localStorage.getItem( "lang") || "en",
      //hideNav: true

    }
  },
  created: function () {
    socket.on( "uiLabels", labels => this.uiLabels = labels );
    socket.emit( "getUILabels", this.lang );
  },
  
}
</script>

<style scoped>
.container {
  display:block; 
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh; 
  width: 100vw; 
  background: linear-gradient(135deg, #0a0347, #3c298f); 
  background-attachment: fixed; 
  background-size: cover; 
  text-align: center;
  box-sizing: border-box; 
}

.makeQuizButton, .selectQuizButton{
  border: none;
  cursor: pointer;
  margin-left: 10%; 
  margin-right:10%;
  margin-top:20%;
  font-size: 20px; 
  background-color: rgb(255, 136, 0);
  color: #1e084f; 
  border-radius: 10px; 
  cursor: pointer;
  box-shadow: 0 8px 5px rgba(0, 0, 0, 0.1); 
  transition: background-color 0.3s ease; 
  width: auto;
  height:auto;
  padding: 3vh 2vw;
  text-decoration: none;
}

.makeQuizButton:hover, 
.selectQuizButton:hover {
  background-color: rgb(227, 122, 1);
  box-shadow: 0 8px 6px rgba(0, 0, 0, 0.4);
  transform: scale(1.2); 
}
</style>