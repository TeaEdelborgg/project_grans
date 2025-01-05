<template>
  <div class="container">
      <!--Här ska vi lägga in att man joinar, skicka med att man har gått med-->
      <!--enklare att kanske endast ha lobbyView, kommer annars behöva skicka data emellan?-->

  <label>
      <input type="text" v-model="newPollId" :placeholder= "uiLabels.joinquizPlaceholder">
    </label>
  <!-- <router-link v-bind:to="'/lobby/' + newPollId">
      {{ uiLabels.participatePoll }}
      <button>join</button>
    </router-link>
    <button v-on:click="checkPollStatus"> {{ uiLabels.participatePoll }} join</button>-->
    <transition name="fade">
    <router-link v-if="newPollId" v-bind:to="'/lobby/' + newPollId" class="joinButton">
      <button>
        {{ uiLabels.joinquiz }}
      </button>
    </router-link>
    </transition>
  </div>
</template>

<script>
import io from 'socket.io-client';
//const socket = io("localhost:3000");
const socket = io(sessionStorage.getItem("dataServer")) //for mobile phones osv

export default {
  name: 'Join',

   data: function () {
    return {
      uiLabels: {},
      newPollId: "",
      lang: localStorage.getItem( "lang") || "en",
      hideNav: true
    };
  },
  created: function () {
    socket.on( "uiLabels", labels => this.uiLabels = labels );
    socket.emit( "getUILabels", this.lang );
  },
  methods: {
    checkPollStatus() {
      socket.emit('joinPoll', this.newPollId);
      socket.on('pollStatus', (status) => {
        if (status.started) {
          alert("Too late! This poll has already started...");
        } else {
          this.$router.push('/lobby/' + this.newPollId);
        }
      })
    }
  }
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
  margin: 0; 
  padding: 0; 
  text-align: center;
  box-sizing: border-box; 
}
input[type="text"] {
  margin: 20px auto; 
  margin-top: 160px;
  padding: 15px; 
  font-size: 35px; 
  text-align: center;
  border: 2px solid #000000;
  border-radius: 30px; 
  width: 40%; 
  height: 70px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); 
  background-color: #ffffff;
}

input[type="text"]:focus::placeholder {
  opacity: 0; 
  transition: opacity 0.1s ease-in-out;
}

input[type="text"]:hover {
  background-color: #c0c0c0;
  transition: background-color 0.3s ease;
}

button {
  display: block;
  margin: 30px auto; 
  padding: 15px 40px; 
  font-size: 18px; 
  background-color: rgb(18, 150, 22);
  color: #fff; 
  border: none;
  border-radius: 5px; 
  cursor: pointer;
  box-shadow: 0 8px 6px rgba(0, 0, 0, 0.1); 
  transition: background-color 0.3s ease; 
  width: 220px;
  text-decoration: none;
}

button:hover {
  background-color: rgb(16, 115, 20); 
  box-shadow: 0 8px 6px rgba(0, 0, 0, 0.4); 
}
.joinButton {
  text-decoration: none;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
