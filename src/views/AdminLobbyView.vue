<template>
    <div class="startPollButton">
    <h3> {{ uiLabels.readyMessage }}</h3>
    <h1>{{ uiLabels.pollId }} {{ pollId }}</h1>
    open this page in on a new page to administrate
    <router-link v-bind:to="'/admin/' +pollId">
    <button v-on:click="startPoll">admin View</button>
    </router-link>

    <router-link v-bind:to="'/result/' + pollId">
        <button v-on:click="startPoll">Check result</button>

        </router-link>

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

    <!--<p>{{ uiLabels.participants }}</p>
    <div v-for="(participant, index) in pollData.participants" :key="index">
      {{ participant.information.name }}
    </div>-->
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
  },
    methods: {
    startPoll() {
      socket.emit("startPoll", this.pollId);
    },

}
}
</script>

<style>
.lobbyParticipants {
  list-style: none;
  padding: 0;
}

.participantColor {
  display: inline-block;
  padding: 10px 20px;
  margin: 16px;
  border: 2px solid;
  border-radius: 20px; 
  font-weight: bold;
  text-align: center;
  font-size: 25px;
  box-shadow: 0 0 5px currentColor, 0 0 5px currentColor, 0 0 20px currentColor;
}
</style>
