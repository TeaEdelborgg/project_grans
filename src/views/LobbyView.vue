<template>
  <div>
    {{pollId}}
    <div v-if="!joined">
      <!--Lägg till att välja färg-->
      <input type="text" v-model="userName"> <!-- kalla på en funktion -->
      <button v-on:click="participateInPoll">
        {{ this.uiLabels.participateInPoll }}
      </button>
    </div>
    <div v-if="joined">
      <p>Waiting for host to start poll</p>
      {{ participants }}  <!-- rimligt att man ser vilka som är med men inte all info om dem-->
  </div>
  </div>
</template>

<script>
import io from 'socket.io-client';
const socket = io("localhost:3000");

export default {
  name: 'LobbyView',
  data: function () {
    return {
      userID: "",
      userName: "",
      pollId: "inactive poll",
      uiLabels: {},
      joined: false,
      lang: localStorage.getItem("lang") || "en",
      participants: []
    }
  },
  created: function () {
    this.pollId = this.$route.params.id;
    socket.on( "uiLabels", labels => this.uiLabels = labels );
    socket.on( "participantsUpdate", p => this.participants = p );
    socket.on( "startPoll", () => this.$router.push("/poll/" + this.pollId + '/' + this.userID) ); // lägga till userId i route, ska man skicka med userID i startPoll eller ska man stora här direkt?
    socket.emit( "joinPoll", this.pollId );
    socket.emit( "getUILabels", this.lang );
  },
  methods: {
    participateInPoll: function () {
      this.userID = Math.ceil(Math.random()*1000000)  // random generatred id, ska vi spara som en global konstant eller räcker det att skicka här?
      socket.emit( "participateInPoll", {pollId: this.pollId, name: this.userName, userId: this.userID} ) //färg sen
      this.joined = true;
    }
  }
}
</script>
