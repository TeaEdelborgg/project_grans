<template>
  <div>
    {{ pollId }}
    <div v-if="!joined">
      <input type="text" v-model="userName" placeholder="Enter your name" />
      <input type="color" v-model="selectedColor" />
      <button v-on:click="participateInPoll">
        {{ uiLabels.participateInPoll || "Join Poll" }}
      </button>
    </div>
    <div v-if="joined">
      <p>Waiting for host to start poll</p>
      <p>Current Participants:</p>
      <ul>
        <li v-for="participant in participants" :key="participant.userId">
          {{ participant.information.name }} - Color:{{ participant.information.color }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import io from 'socket.io-client';
//const socket = io("localhost:3000");
const socket = io(sessionStorage.getItem("dataServer")) //for mobile phones osv

export default {
  name: 'LobbyView',
  data() {
    return {
      userID: "",
      userName: "",
      pollId: "inactive poll",
      uiLabels: {},
      joined: false,
      lang: localStorage.getItem("lang") || "en",
      selectedColor: "#ff0000",
      participants: [],
    };
  },
  created() {
    this.pollId = this.$route.params.id;
    socket.on("uiLabels", (labels) => (this.uiLabels = labels));
    socket.on("participantsUpdate", (p) => {
      this.participants = p;
    });
    socket.on("startPoll", () =>
      this.$router.push("/poll/" + this.pollId + "/" + this.userID)
    );
    socket.emit("joinPoll", this.pollId);
    socket.emit("getUILabels", this.lang);
  },
  methods: {
    participateInPoll() {
      this.userID = Math.ceil(Math.random() * 1000000); // Generate unique ID
      socket.emit("participateInPoll", {
        pollId: this.pollId,
        name: this.userName,
        userId: this.userID,
        color: this.selectedColor, //skickar färg t admin
      });
      this.joined = true;
    },
}};
</script>

<style scoped>
/*
.boxes {
  display: flex;
  gap: 10px;
}
.box {
  width: 100px;
  height: 100px;
  border: 1px solid #000;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
.box.taken {
  background-color: #ccc;
  cursor: not-allowed;
}*/
</style>
