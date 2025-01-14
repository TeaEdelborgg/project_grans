<template>
  <div class="admin">
    <h1>{{ uiLabels.adminPanel }}</h1>
    <GameStatus v-bind:uiLabels="uiLabels" v-bind:numberPlayers="numberPlayers"
      v-bind:numberPlayersAnswered="numberPlayersAnswered" v-bind:currentQuestion="quizData.currentQuestion"
      v-bind:questionAmount="quizData.questionAmount" v-bind:questions="quizData.questions" />
    <GameControls @runQuestion="runQuestion()" @endQuestion="endQuestion()" @finishGame="finishGame()"
      v-bind:uiLabels="uiLabels" v-bind:currentQuestion="quizData.currentQuestion"
      v-bind:questionAmount="quizData.questionAmount" v-bind:canStartNextQuestion="canStartNextQuestion" />
    <ParticipantControls v-bind:quizData="quizData" v-bind:uiLabels="uiLabels" />
    <EndGame @finishGame="finishGame" v-bind:uiLabels="uiLabels" />
  </div>
</template>

<script>
import io from 'socket.io-client';
const socket = io(sessionStorage.getItem("dataServer"));

import PopupEndGame from '../components/PopupEndGame.vue';
import ParticipantControls from '../components/ParticipantControls.vue';
import GameStatus from '../components/GameStatus.vue';
import GameControls from '../components/GameControls.vue';
import EndGame from '../components/EndGame.vue';

export default {
  name: 'AdminView',
  components: {
    PopupEndGame,
    ParticipantControls,
    GameStatus,
    GameControls,
    EndGame,
  },
  data: function () {
    return {
      lang: localStorage.getItem("lang") || "en",
      quizId: "",
      uiLabels: {},
      quizData: {},
      numberPlayers: 0,
      numberPlayersAnswered: 0,
      canStartNextQuestion: true,
    }
  },
  created: function () {
    this.quizId = this.$route.params.id;

    socket.on("uiLabels", labels => this.uiLabels = labels);
    socket.on("quizData", data => {
      this.quizData = data
      this.getNumberPlayers();
    });
    socket.on("participantsUpdate", (p) => {
      this.quizData.participants = p
      this.getNumberPlayers();
      this.getnumberPlayersAnswered();
    });
    socket.on('currentQuestionUpdate', (questionNumber) => {
      this.quizData.currentQuestion = questionNumber
    });
    socket.on('scoreBoardCreated', () => {
      socket.emit('finishGame', this.quizId)
    });

    socket.emit("joinQuiz", this.quizId);
    socket.emit("getUILabels", this.lang);
    socket.emit("updateResult", this.quizId);

  },
  methods: {
    getNumberPlayers: function () {
      this.numberPlayers = this.quizData.participants.length
    },
    getnumberPlayersAnswered: function () {
      this.numberPlayersAnswered = 0
      const qId = this.quizData.currentQuestion
      for (let i = 0; i < this.numberPlayers; i++) {
        if (this.quizData.participants[i].information.answers[qId][0] !== null) {
          this.numberPlayersAnswered++
          if (this.numberPlayersAnswered == this.numberPlayers) {
            this.endQuestion()
            setTimeout(() => {
              this.canStartNextQuestion = true
            }, 2000)
          }
        }
      }
    },
    runQuestion: function () {
      this.canStartNextQuestion = false
      const currentQuestion = this.quizData.currentQuestion + 1;
      this.numberPlayersAnswered = 0
      socket.emit('runCountdown', { quizId: this.quizId, questionNumber: currentQuestion })
    },
    endQuestion: function() {
      socket.emit('endTimer', this.quizId)
    },
    finishGame: function () {
      socket.emit('createScoreBoard', this.quizId)
      setTimeout(() => {
        socket.emit('clearParticipants', this.quizId)
        this.$router.push('/')
      }, 5000)
    },
  }
}
</script>

<style>
.admin {
  position: relative;
  min-height: 90.7vh;
  color: #cfcfcf;
  background: radial-gradient(#1a237e, #0d1137);
  padding: 2%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
}

.admin h1 {
  font-size: 2em;
  margin: 0.5em;
  text-transform: uppercase;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  margin: 0.5em 0;
  padding: 0.5em;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
}

.admin h2 {
  font-size: 1.8em;
  margin: 0.5em;
  color: #f9ac33;
  text-transform: uppercase;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.game-button {
  align-items: center;
  background-image: linear-gradient(135deg, #ff8800 40%, #ff9d00);
  border: 1%;
  border-radius: 10px;
  border-color: #d97400;
  color: #eae9e9;
  cursor: pointer;
  font-size: 90%;
  font-weight: 700;
  padding: 1em;
  margin: 1em;
  text-transform: uppercase;
}

.game-button:hover {
  transform: scale(1.05);
  filter: brightness(80%)
}

.finish-button {
  background-image: linear-gradient(135deg, #ff5e3e 40%, #ff4800);
  border-color: #e85537;
}

.popup-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  overflow: hidden;
}
</style>