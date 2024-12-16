<template>
    <!--Här ska vi lägga in att man joinar, skicka med att man har gått med-->
    <!--enklare att kanske endast ha lobbyView, kommer annars behöva skicka data emellan?-->

<label>
    Write poll id: 
    <input type="text" v-model="newPollId">
  </label>
 <!-- <router-link v-bind:to="'/lobby/' + newPollId">
    {{ uiLabels.participatePoll }}
    <button>join</button>
  </router-link>-->
  <button v-on:click="checkPollStatus"> {{ uiLabels.participatePoll }} join</button>

        
   
</template>

<script>
import io from 'socket.io-client';
const socket = io("localhost:3000");

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
