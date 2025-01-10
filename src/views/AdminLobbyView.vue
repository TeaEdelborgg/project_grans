<template>
  <div class="container">
    <div class="adminSection">


    <div class="PollID">
      <h1>{{ uiLabels.pollId }} {{ pollId }}</h1>
    </div>


    <div class="adminButtons">
      <router-link v-bind:to="'/admin/' +pollId" >
        <button :disabled="!openResult" v-on:click="startPoll">{{ uiLabels.adminView }}
        </button>
      </router-link>
      <router-link
        :to="'/resultLobby/' + pollId"
        custom
        v-slot="{ href }"
      >
        <a :href="href" target="_blank">
          <button v-on:click="enableAdminButton">{{ uiLabels.showBoard }}</button>
        </a>
      </router-link>
      <p>{{ uiLabels.letParticipantsJoin }}</p>
      <!--<router-link v-bind:to="'/result/' + pollId">
        <button v-on:click="startPoll">Check result</button>
      </router-link>-->
    </div>
    </div>


    <div class="waitingLobby">
      <p>{{uiLabels.currentParticipants}}</p>
     
      <ul class="lobbyParticipants">
        <li v-for="participant in participants"
          :key="participant.userId"
          :style="{ color: participant.information.color, borderColor: participant.information.color }"
          class="participantColor">
          {{ participant.information.name }}
        </li>
      </ul>


      </div>


      <div :class="['overlay', {show:gameRules}]" v-on:click="closeGameRules"></div>
      <div :class="['RulesPopup', {show:gameRules}]">
        <h4>{{uiLabels.Instructions}}</h4>
          <li>{{ uiLabels.instructLi1 }}</li>
          <li>{{ uiLabels.instructLi2 }}</li>
          <li>{{ uiLabels.instructLi3 }}</li>
          <li>{{ uiLabels.instructLi4 }}</li>
          <h2>{{ uiLabels.goodluck }}</h2>


        <button @click="closeGameRules">X</button>
      </div>
  </div>
</template>


<script>
import io from "socket.io-client";
const socket = io(sessionStorage.getItem("dataServer"));


export default{
    name: "AdminLobbyView",
    data() {
        return {
        lang: localStorage.getItem("lang") || "en",
        pollId: "inactive poll",
        uiLabels: {},
        participants: [],
        gameRules: false,
        openResult: false
        };
    },


    created() {
      this.pollId = this.$route.params.id;
      socket.on("uiLabels", (labels) => (this.uiLabels = labels));
      socket.on("participantsUpdate", (p) => {
        this.participants = p;
      });


      socket.emit("joinPoll", this.pollId);
      socket.emit("getParticipants", this.pollId)
      socket.emit("getUILabels", this.lang);
      this.gameRules = true;
    },


    methods: {
      startPoll() {
        socket.emit("startPoll", this.pollId);
      },
      toggleGameRules() {
      this.gameRules = !this.gameRules;
      },
      closeGameRules() {
        this.gameRules = false;
      },
      enableAdminButton() {
      this.openResult = true; // Enable the Admin View button
      },


}
}
</script>


<style scoped>
.container {
  display: flex;
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
.PollID {
  text-align: center;
  padding: 20px;
  border: 2px solid rgb(255, 255, 255);
  border-radius: 10px;
  width: 600px;
  height: 150px;
  margin: 60px auto;
  margin-top: 110px;
  margin-bottom: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  font-family: monospace;
}
.waitingLobby {
  text-align: center;
  padding: 20px;
  background: linear-gradient(135deg, #1e0880,  #06012e);
  border-radius: 10px;
  width:1100px;
  height: 100px;
  margin: 60px auto;
  margin-bottom: 0px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
.waitingLobby p {
  font-size: 1rem;
  color: #edededec;
  font-family: Verdana, Tahoma, sans-serif;
  margin-top: 0;
}
h2 {
  color: #000000;
  font-size: 100%;
}
h1 {
  color: rgb(255, 255, 255);
  font-size: 450%;
}
h4 {
  color: #000000;
  font-size: 200%;
  margin-bottom: 16px;
  margin-top: 0;
}


.lobbyParticipants {
  list-style: none;
  padding: 0;
}
.adminButtons p{
  color: rgb(255, 255, 255);
  margin-right: 400px;
  margin-bottom: 0;
  font-size: 12px;
}
.adminButtons button{
  border: none;
  cursor: pointer;
  margin-left: 190px;
  margin-right: 190px;
  font-size: 13px;
  background-color: rgb(255, 136, 0);
  color: #1e084f;
  border-radius: 15px;
  cursor: pointer;
  box-shadow: 0 8px 5px rgba(0, 0, 0, 0.1);
  width: 130px;
  height:30px;
  text-decoration: none;
  font-weight: bold;
}

.adminButtons button:hover{
  background-color: rgb(227, 122, 1);
  box-shadow: 0 8px 6px rgba(0, 0, 0, 0.4);
  transform: scale(1.2);
}
.adminButtons button:disabled {
  cursor: default;
  opacity: 50%;
  box-shadow: none; 
  transform: none; 
}

.adminButtons button:disabled:hover {
  background-color: rgb(255, 136, 0); 
  box-shadow: none; 
  transform: none; 
}
.participantColor {
  display: inline-block;
  padding: 10px 20px;
  margin: 16px;
  border: 2px solid;
  border-radius: 20px;
  font-weight: bold;
  text-align: center;
  font-size: 18px;
  box-shadow: 0 0 5px currentColor, 0 0 5px currentColor, 0 0 20px currentColor;
}


.RulesPopup {
  position: fixed;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0);
  background: rgba(255, 255, 255, 0.9);
  padding: 20px;
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.4);
  width: 80%;
  max-width: 400px;
  border-radius: 10px;
  z-index: 100;
  opacity: 0;
  transition: transform 0.4s ease, opacity 0.4s ease;
}


.RulesPopup.show {
  transform: translate(-50%, -50%) scale(1);
  opacity: 1;
}


.RulesPopup button {
  background: rgb(255, 255, 255);
  color: rgb(0, 0, 0);
  border: none;
  padding: 5px 5px;
  cursor: pointer;
  position: absolute;
  height: 26px;
  width: 25px;
  top: 5px;
  left: 400px;
}


.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.842);
  opacity: 0;
  transition: opacity 0.4s ease;
  pointer-events: none;
  z-index: 100;
}


.overlay.show {
  opacity: 1;
}


.RulesPopup li {
  text-align: left;
  margin-bottom: 8px;
}
</style>

