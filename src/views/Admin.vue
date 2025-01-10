<template>
  <div class="admin">
    <h1>{{uiLabels.adminPanel}}</h1>
    <section class="game-status">
      <h2>{{uiLabels.gameStatus}}</h2>
      <div>
        <p>{{uiLabels.numberOfAnswers + numberPlayersAnswered }}/{{ numberPlayers }}</p>
        <p>{{uiLabels.currentQuestion + (pollData.currentQuestion + 1) }}/{{ pollData.questionAmount }}</p>
      </div>
      <div class="questions">
        <button class="game-button" @click="toggleQuestions">{{uiLabels.viewQuestionsAnswers}}</button>
        <div class="popup" v-if="showQuestions" @click.self="close">
          <PopupQuestions :showQuestions="showQuestions" :questions="pollData.questions"
            @close="toggleQuestions" />
        </div>
      </div>
    </section>

    <section class="game-controls">
      <h2>{{uiLabels.controlGame}}</h2>
      <button class="game-button" v-if="pollData.currentQuestion == -1" @click="runQuestion">{{uiLabels.startGame}}</button>
      <button class="game-button" v-else-if="pollData.currentQuestion + 1 != pollData.questionAmount && canStartNextQuestion" 
        @click="runQuestion">
        {{uiLabels.nextQuestion}}
      </button>
      <button class="game-button" v-else-if="!canStartNextQuestion" 
        @click="endQuestion">
        {{uiLabels.finishQuestion}}
      </button> 
      <button class="game-button" v-else 
        @click="finishGame">
        {{uiLabels.ViewFinalResults}}
      </button>
    </section> <br>

    <section class="participant-controls"> <!-- lägga in för att kunna ta bort spelare här? -->
      <h2>{{uiLabels.players}}</h2>
      <PlayersAdmin :pollData="pollData" />
    </section>

    <section class="end-game">
      <button class="game-button" @click="toggleEndGame">{{uiLabels.finishEarly}}</button>
      <div class="popup" v-if="showEndGame" @click.self="toggleEndGame">
        <PopupEndGame :showEndGame="showEndGame" @close="toggleEndGame" @end="finishGame" />
      </div>
    </section>

    <router-link v-bind:to="'/result/' + pollId">{{uiLabels.checkResult}}</router-link>

  </div>
</template>

<script>
import io from 'socket.io-client';
const socket = io(sessionStorage.getItem("dataServer"));
import PopupQuestions from '../components/PopupQuestions.vue';
import PopupEndGame from '../components/PopupEndGame.vue';
import PlayersAdmin from '../components/PlayersAdmin.vue';

export default {
  name: 'AdminView',
  components: {
    PopupQuestions,
    PopupEndGame,
    PlayersAdmin,
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
      showQuestions: false,
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
    test: function () {
      console.log(this.pollData.participants)
    },
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
    toggleQuestions() {
      this.showQuestions = !this.showQuestions;
    },
    toggleEndGame() {
      this.showEndGame = !this.showEndGame
    }
  }
}
</script>

<style scoped>
.admin {
  position: relative;
  min-height: 90.7vh;
  color: #cfcfcf;
  background: radial-gradient(#1a237e, #0d1137);
  padding: 2%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
}

h1 {
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

.game-button:hover:enabled {
  background-image: linear-gradient(135deg, #d16f00 40%, #dd8800);
  border-color: #bd782a;
  color: #d6b79f
}

.end-game {
  position: absolute;
  bottom: 3vh;
  right: 2vw;
}

.game-status {
  position: absolute;
  top: 20vh;
  left: 3vw;
  background: #4c3100;
  padding: 10px;
  color: #c7c7c7;
  border-radius: 5px;
}

.popup {
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