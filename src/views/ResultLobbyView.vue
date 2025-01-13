<template>
  <div class="container">
    <div class="adminSection">


      <div class="QuizID">
        <h1>{{ uiLabels.quizId }} {{ quizId }}</h1>
      </div>


      <div class="adminButtons">
      </div>
    </div>


    <div class="waitingLobby">
      <p>{{ uiLabels.currentParticipants }}</p>

      <ul class="lobbyParticipants">
        <li v-for="participant in participants" :key="participant.userId"
          :style="{ color: participant.information.color, borderColor: participant.information.color }"
          class="participantColor">
          {{ participant.information.name }}
        </li>
      </ul>
    </div>
  </div>
</template>


<script>
import io from "socket.io-client";
const socket = io(sessionStorage.getItem("dataServer"));


export default {
  name: "ResultLobbyView",
  data() {
    return {
      lang: localStorage.getItem("lang") || "en",
      quizId: "inactive quiz",
      uiLabels: {},
      participants: [],
    };
  },


  created() {
    this.quizId = this.$route.params.id;
    socket.on("uiLabels", (labels) => (this.uiLabels = labels));
    /*socket.on("startQuiz", (this.quizId ))*/
    socket.on('startQuiz', () =>
      this.$router.push('/game/' + this.quizId)
    );
    socket.on("participantsUpdate", (p) => {
      this.participants = p;
    });


    socket.emit("joinQuiz", this.quizId);
    socket.emit("getParticipants", this.quizId)
    socket.emit("getUILabels", this.lang);
  },


  methods: {
    startQuiz() {
      socket.emit("startQuiz", this.quizId);
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
  overflow:auto;
}

.QuizID {
  text-align: center;
  padding: 20px;
  border: 2px solid rgb(255, 255, 255);
  border-radius: 10px;
  width: 85%;
  max-width: 600px;
  height: auto;
  margin: 5vh auto 2vh;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  font-family: monospace;
}

.waitingLobby {
  text-align: center;
  padding: 20px;
  background: linear-gradient(135deg, #1e0880, #06012e);
  border-radius: 10px;
  width:85%;
  height: 23vh;
  margin: 5vh auto 0vh;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.waitingLobby p {
  font-size: 1rem;
  color: #edededec;
  font-family: Verdana, Tahoma, sans-serif;
  margin-top: 0;
}

h1 {
  color: rgb(255, 255, 255);
  font-size: 450%;
}

.lobbyParticipants {
  list-style: none;
  padding: 0;
}

.participantColor {
  display: inline-block;
  padding: 10px 20px;
  margin: 1vh;
  border: 2px solid;
  border-radius: 20px;
  font-weight: bold;
  text-align: center;
  font-size: 18px;
  box-shadow: 0 0 5px currentColor, 0 0 5px currentColor, 0 0 20px currentColor;
}
</style>