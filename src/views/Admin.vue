<template>
  <div class="admin">
    <h1>{{ uiLabels.adminPanel }}</h1>
    <GameStatus v-bind:uiLabels="uiLabels" v-bind:numberPlayers="numberPlayers" 
      v-bind:numberPlayersAnswered="numberPlayersAnswered" v-bind:currentQuestion="pollData.currentQuestion" 
      v-bind:questionAmount="pollData.questionAmount" v-bind:questions="pollData.questions"/>

    <GameControls @runQuestion="runQuestion()" @endQuestion="endQuestion()"
    v-bind:uiLabels="uiLabels" v-bind:currentQuestion="pollData.currentQuestion" 
    v-bind:questionAmount="pollData.questionAmount" v-bind:canStartNextQuestion="canStartNextQuestion"/>

    <section class="participant-controls">
      <h2>{{ uiLabels.players }}</h2>
      <PlayersAdmin :pollData="pollData" :uiLabels="uiLabels" />
    </section>

    <section class="end-game">
      <button class="game-button finish-button" @click="toggleEndGame">{{ uiLabels.finishEarly }}</button>
      <div class="popup-background" v-if="showEndGame" @click.self="toggleEndGame">
        <PopupEndGame :showEndGame="showEndGame" :uiLabels="uiLabels" @close="toggleEndGame" @end="finishGame" />
      </div>
    </section>
  </div>
</template>

<script>
import io from 'socket.io-client';
const socket = io(sessionStorage.getItem("dataServer"));
import PopupEndGame from '../components/PopupEndGame.vue';
import PlayersAdmin from '../components/PlayersAdmin.vue';
import GameStatus from '../components/GameStatus.vue';
import GameControls from '../GameControls.vue';

export default {
  name: 'AdminView',
  components: {
    PopupEndGame,
    PlayersAdmin,
    GameStatus,
    GameControls,
  },
  data: function () {
    return {
      lang: localStorage.getItem("lang") || "en",
      pollId: "",
      uiLabels: {},
      pollData: {},
      numberPlayers: 0,
      numberPlayersAnswered: 0,
      canStartNextQuestion: true,
      showEndGame: false,
    }
  },
  created: function () {
    this.pollId = this.$route.params.id;

    socket.on("uiLabels", labels => this.uiLabels = labels);
    socket.on("pollData", data => {
      this.pollData = data
      this.getNumberPlayers();
    });
    socket.on("participantsUpdate", (p) => {
      this.pollData.participants = p
      this.getNumberPlayers();
      this.getnumberPlayersAnswered();
    });
    socket.on('currentQuestionUpdate', (questionNumber) => {
      this.pollData.currentQuestion = questionNumber
    });
    socket.on('scoreBoardCreated', () => {
      socket.emit('finishGame', this.pollId)
    });

    socket.emit("joinPoll", this.pollId);
    socket.emit("getUILabels", this.lang);
    socket.emit("updateResult", this.pollId);

  },
  methods: {
    getNumberPlayers: function () {
      this.numberPlayers = this.pollData.participants.length
    },
    getnumberPlayersAnswered: function () {
      this.numberPlayersAnswered = 0
      const qId = this.pollData.currentQuestion
      for (let i = 0; i < this.numberPlayers; i++) {
        if (this.pollData.participants[i].information.answers[qId][0] !== null) {
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
      const currentQuestion = this.pollData.currentQuestion + 1;
      this.numberPlayersAnswered = 0
      socket.emit('runCountdown', { pollId: this.pollId, questionNumber: currentQuestion })
    },
    endQuestion() {
      socket.emit('endTimer', this.pollId)
    },
    finishGame: function () {
      socket.emit('createScoreBoard', this.pollId)
      setTimeout(() => {
        socket.emit('clearParticipants', this.pollId)
        this.$router.push('/') // eller skickas någon annanstans? hur ska man göra? idk
      }, 2000)
    },
    toggleEndGame() {
      this.showEndGame = !this.showEndGame
    }
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
  color: #eae9e9;
  text-transform: uppercase;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  margin: 10px 0;
  padding: 12px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
  transition: background-color 0.3s ease;
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

.end-game {
  position: absolute;
  bottom: 3vh;
  right: 2vw;
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

.participant-controls {
  max-width: 50%;
  margin-inline: auto;
}
</style>