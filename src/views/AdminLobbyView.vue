<template>
  <div class="container">
    <h1>Adminview</h1>
    <div>


    <div class="QuizID">
      <h2>{{ uiLabels.quizId }} {{ quizId }}</h2>
    </div>


    <div class="adminButtons">
      <button ref="startQuizButton" :disabled="!openResult" @click="handleStartQuizClick">{{ uiLabels.startQuiz }}</button>
      <router-link
        :to="'/resultLobby/' + quizId"
        custom
        v-slot="{ href }"
      >
        <a :href="href" target="_blank">
          <button v-on:click="enableAdminButton">{{ uiLabels.showBoard }}</button>
        </a>
      </router-link>
      

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
          <h3>{{ uiLabels.goodluck }}</h3>


        <button @click="closeGameRules">X</button>
      </div>
      
      <div :class="['overlay', { show: startQuizPopup }]" @click="closeQuizPopup"></div>
      <div :class="['QuizPopup', { show: startQuizPopup }]">
        <p>{{ uiLabels.letParticipantsJoin }}</p>
        <button id="goBack" @click="closeQuizPopup">{{uiLabels.goBack}}</button>
        <router-link :to="'/admin/' + quizId">
          <button @click="startQuiz">{{ uiLabels.startQuiz }}</button>
        </router-link>
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
        quizId: "inactive quiz",
        uiLabels: {},
        participants: [],
        gameRules: false,
        openResult: false,
        startQuizPopup: false,
        };
    },


    created() {
      this.quizId = this.$route.params.id;
      socket.on("uiLabels", (labels) => (this.uiLabels = labels));
      socket.on("participantsUpdate", (p) => {
        this.participants = p;
      });


      socket.emit("joinQuiz", this.quizId);
      socket.emit("getParticipants", this.quizId)
      socket.emit("getUILabels", this.lang);
      this.gameRules = true;
    },


    methods: {
      startQuiz() {
        socket.emit("startQuiz", this.quizId);
      },
      toggleGameRules() {
      this.gameRules = !this.gameRules;
      },
      closeGameRules() {
        this.gameRules = false;
      },
      enableAdminButton() {
        this.openResult = true; // changed to "startQuiz" button
      },
      handleStartQuizClick() {
      if (!this.$refs.startQuizButton.disabled) {
        this.startQuizPopup = true;
      }
    },
    closeQuizPopup() {
      this.startQuizPopup = false;
    }


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
h1 {
  color: #cfcfcf;
  text-transform: uppercase;
}
.QuizID {
  text-align: center;
  padding: 20px;
  border: 2px solid rgb(255, 255, 255);
  border-radius: 10px;
  width: 600px;
  height: 150px;
  margin: 30px auto 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  font-family: monospace;
}
.waitingLobby {
  text-align: center;
  padding: 20px;
  background: linear-gradient(135deg, #1e0880,  #06012e);
  border-radius: 10px;
  width:95vw;
  height: 23vh;
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
h3 {
  color: #000000;
  font-size: 100%;
}
h2 {
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
  cursor: not-allowed;
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
  background: rgba(0, 0, 0, 0.7);
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

.QuizPopup {
  background: linear-gradient(135deg, #0a0347, #3c298f);
  color: #cfcfcf;
  font-size:20px;
  padding: 5vh 5vw;
  border-radius: 10px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  text-align: center;
  width: 80%;
  max-width: 30vw;
  position: fixed;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0);
  opacity: 0;
  transition: transform 0.4s ease, opacity 0.4s ease;
  z-index: 100;
  gap:10%;
}

.QuizPopup.show {
  transform: translate(-50%, -50%) scale(1);
  opacity: 1;
}


.QuizPopup button {
  border: none;
  cursor: pointer;
  font-size: 20px;
  font-weight: bold;
  background-color: rgb(255, 136, 0);
  color: #1e084f;
  border-radius: 10px;
  margin: 1vh 2vw;
  padding: 1vh 1vw;
  box-shadow: 0 8px 5px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease, transform 0.3s ease;
}
.QuizPopup #goBack{
  background-color: #cfcfcf;
}

.QuizPopup button:hover {
  background-color: rgb(227, 122, 1);
  box-shadow: 0 8px 6px rgba(0, 0, 0, 0.4);
  transform: scale(1.2);
}

@media (max-width: 480px) {
  .waitingLobby {
    width:200px;
    height: 120px;
    margin-top: 4px;
  }
  .waitingLobby p{
    font-size: 10px;
  }
  .participantColor {
    padding: 8px 16px;
    margin: 1vw;
    font-size: 70%;
  }
  .QuizID {
  width: 200px;
  height: 150px;
  }
  h2 {
  font-size: 300%;
  }
  .container {
  height: 100vh;
  width: 100vw;
  }
  .adminButtons button{
    margin-left: 1px;
    margin-right: 1px;
    font-size: 12px;
    width: 115px;
    height:25px;
  }
  .RulesPopup button {
    left: 210px;
  }
  .RulesPopup  {
    margin-top: 50px;
    font-size: 13px;
  }
  .QuizPopup {
    font-size:20px;
    max-width: 180px;
  }
}
</style>

