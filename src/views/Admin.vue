<template>
  <div class="admin">
    <h1>Admin Panel</h1>
    <section class="game-status">
      <h2>Spelstatus</h2>
      <div>
        <p>Antal svar inkommna: {{ numberPlayersAnswered }}/{{ numberPlayers }}</p>
        <p>Nuvarande fråga: {{ pollData.currentQuestion + 1 }}/{{ pollData.questionAmount }}</p>
      </div>
      <div class="questions">
        <button class="game-button" @click="toggleQuestions">Visa frågor och svar</button>
        <div class="popup" v-if="showQuestions" @click.self="toggleQuestions">
          <div class="popup-content">
            <button class="close-button" @click="toggleQuestions">x</button>
            <h3>Frågor och svar</h3>
            <li v-for="(question, index) in pollData.questions" :key="index">
              <strong>Fråga {{ index + 1 }}:</strong> {{ question.q }}<br>
              <strong>Rätt svar:</strong> {{ question.a.correct }}<br>
              <strong>Fel svar:</strong> {{ question.a.wrong.join(', ') }}<br><br>
            </li>
          </div>
        </div>
      </div>
    </section>

    <section class="game-controls">
      <h2>Styr spelet</h2>
      <button class="game-button" v-if="pollData.currentQuestion + 1 != pollData.questionAmount && canStartNextQuestion" 
        @click="runQuestion">
        Nästa fråga
      </button>
      <button class="game-button" v-else-if="!canStartNextQuestion" 
        @click="endQuestion">
        Avsluta aktuell fråga
      </button> 
      <button class="game-button" v-else 
        @click="finishGame">
        Visa slutresultat
      </button>
    </section> <br>

    <section class="participant-controls"> <!-- lägga in för att kunna ta bort spelare här? -->
      <h2>Spelare</h2>
      <div class="participants"> 
        <div v-for="(participant, index) in pollData.participants" :key="index">
          <div class="one-participant"> 
            <strong>{{ participant.information.name }}</strong> <!-- sätta som p ist? -->
            <div v-if="participant.information.answers[pollData.currentQuestion][0] == null">
              Svarade: <div class="animatedDots"></div><div class="animatedDots"></div><div class="animatedDots"></div>
            </div>
            <div v-else>
              Svarade: {{ participant.information.answers[pollData.currentQuestion][0] || "Har inte svarat ännu" }}
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="end-game">
      <button class="game-button" v-on:click="finishGame()">Avsluta spelet tidigare?</button>
    </section>
    
    <router-link v-bind:to="'/result/' + pollId">Check result</router-link>
    
  </div>
</template>

<script>
import io from 'socket.io-client';
const socket = io(sessionStorage.getItem("dataServer"))

export default {
  name: 'AdminView',
  data: function () {
    return {
      lang: localStorage.getItem("lang") || "en",
      pollId: "",
      pollData: {},
      uiLabels: {},
      questionList: [],
      answerList: [],
      numberPlayers: 0,
      numberPlayersAnswered: 0, 
      canStartNextQuestion: true,
      showQuestions: false,
    }
  },
  created: function () {
    this.pollId = this.$route.params.id;

    socket.on( "uiLabels", labels => this.uiLabels = labels );
    socket.on( "pollData", data => {
      this.pollData = data; 
    });
    socket.on("participantsUpdate", (p) => {
      this.pollData.participants = p 
      this.getNumberPlayers();
      this.getnumberPlayersAnswered();
    });
    socket.on('currentQuestionUpdate', (questionNumber) => {
      this.pollData.currentQuestion = questionNumber
    });
    socket.on('scoreBoardCreated', ()=>{
      socket.emit('finishGame', this.pollId)
    });

    socket.emit("joinPoll", this.pollId);
    socket.emit( "getUILabels", this.lang );
    socket.emit("updateResult", this.pollId);

  },
  methods: {
    test: function() {
      console.log(this.pollData.participants)
    },
    getNumberPlayers: function() {
      this.numberPlayers = this.pollData.participants.length
    },
    getnumberPlayersAnswered: function() {
      this.numberPlayersAnswered = 0
      const qId = this.pollData.currentQuestion
      for (let i=0; i < this.numberPlayers; i++){
        if (this.pollData.participants[i].information.answers[qId][0] !== null) {
          this.numberPlayersAnswered++
          if (this.numberPlayersAnswered == this.numberPlayers) {
            this.endQuestion()
            setTimeout(()=>{
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
      socket.emit('runCountdown', {pollId: this.pollId, questionNumber: currentQuestion})
    },
    endQuestion() {
      socket.emit('endTimer', this.pollId)
    },
    finishGame: function(){
      socket.emit('createScoreBoard', this.pollId)
      console.log(this.pollData.participants)
      setTimeout(()=>{
        socket.emit('clearParticipants', this.pollId)
        console.log('participants cleared')
      }, 2000)
    },
    toggleQuestions() {
      this.showQuestions = !this.showQuestions;
    },
  }
}
</script>

<style scoped>
.admin {
  position: relative;
  min-height: 86vh;
  margin: 1%;
  color: #cfcfcf;
  background: radial-gradient(#1a237e, #0d1137);;
  padding: 2%;
  border-radius: 10px;
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
h2 {
  font-size: 1.8em;
  margin: 0.5em;
  color: #f9ac33; /*#ff6f00*/
  text-transform: uppercase;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}
.game-button {
  align-items: center;
  background-image: linear-gradient(135deg, #fF6E00 40%, #FF8800);
  border: 1%; 
  border-radius: 10px;
  border-color: #FF8800;
  color: #eae9e9;
  cursor: pointer;
  font-size: 90%;
  font-weight: 700;
  padding: 1em;
  margin:1em;
  text-transform: uppercase;
}
.game-button:hover:enabled {
  background-image: linear-gradient(135deg, #fF6E00 40%, #FF8800);
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
.popup-content {
  position: relative;
  background: #0d1137;
  color: #c7c7c7;
  padding: 20px;
  border-radius: 10px;
  width: 90%; 
  max-width: 600px; 
  max-height: 80vh;
  overflow-y: auto; 
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4); 
}
/* till scrollbar */
.popup-content::-webkit-scrollbar { /* självaste scrollbaren */
  width: 10px;
}
.popup-content::-webkit-scrollbar-thumb { /* det som man drar i */
  background: #2e2e2e;
  border-radius: 10px;
}
.popup-content::-webkit-scrollbar-thumb:hover {
  background: #212121;
}
.popup-content::-webkit-scrollbar-track { /* det som den ligger i */
  background: #565656;
  border-radius: 10px;
}
.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: #fF6E00;
  color: #c7c7c7;
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  text-align: center;
  line-height: 30px;
}
.close-button:hover {
  background: #bd782a;
}
.participant-controls{
  max-width: 50%;
  margin-inline: auto;
}
.participants {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 5%;
}
.one-participant {
  background: #2e2e2e;
  padding: 5%;
  margin: 3%;
  border-radius: 5px;
  color: #cfcfcf;
  text-align: center;
  width: 12vw; 
  min-height: 11vh;
}

/* animering av prickar nedan */
.animatedDots {
  height: 0.3rem;
  width: 0.3rem;
  border-radius:50%;
  animation: dotsAnimation 2s ease-in-out infinite;
  display: inline-block;
  margin:.1rem;
}
@keyframes dotsAnimation {
  0%, 100%{
    transform: scale(0.2);
    background-color: #30FFB7;
  }
  40%{
    transform: scale(1);
    background-color: #07DEFF;
  }
  50%{
    transform: scale(1);
    background-color: #0761FF;
  }
}
.animatedDots:nth-child(0){
  animation-delay:0s;
}
.animatedDots:nth-child(1){
  animation-delay:0.2s;
}
.animatedDots:nth-child(2){
  animation-delay:0.4s;
}
.animatedDots:nth-child(3){
  animation-delay:0.6s;
}
</style>