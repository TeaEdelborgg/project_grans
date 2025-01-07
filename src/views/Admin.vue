<template>
<button @click="test">
  test
</button>
  <div class="admin">
    <section class="game-status">
      <h2>Spelstatus</h2>
      <p>Antal svar inkommna: {{ numberPlayersAnswered }}/{{ numberPlayers }}</p>
      <p>Nuvarande fråga: {{ pollData.currentQuestion + 1 }}</p>
    </section>

    <section class="game-controls">
      <h2>Frågor</h2>
      <button v-if="pollData.currentQuestion + 1 != pollData.questionAmount" @click="runQuestion" :disabled="!canStartNextQuestion">
        Nästa fråga
      </button>
      <button v-else @click="finishGame">Visa slutresultat</button>
      <button @click="endQuestion" :disabled="canStartNextQuestion">Avsluta aktuell fråga</button> <br>
      <button v-on:click="finishGame()">Avsluta spelet</button>
      <router-link v-bind:to="'/result/' + pollId">Check result</router-link>
    </section>

    <section class="participants">
      <h2>Spelarnas svar</h2>
      <ul>
        <li v-for="(participant, index) in pollData.participants" :key="index">
          {{ participant.information.name }} svarade: 
          {{ participant.information.answers[pollData.currentQuestion] || "Har inte svarat ännu" }}
        </li>
      </ul>
    </section>

    <section class="questions">
      <h2>Frågor och svar</h2>
      <button @click="toggleQuestions">Visa/Dölj frågor och svar</button>
      <ul v-show="showQuestions">
        <li v-for="(question, index) in pollData.questions" :key="index">
          <strong>Fråga {{ index + 1 }}:</strong> {{ question.q }}<br>
          <strong>Rätt svar:</strong> {{ question.a.correct }}<br>
          <strong>Fel svar:</strong> {{ question.a.wrong.join(', ') }}<br><br>
        </li>
      </ul>
    </section>
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
        if (this.pollData.participants[i].information.answers[qId] !== null) {
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
  margin: 3%;
  color: #cfcfcf;
  background: radial-gradient(#1a237e, #0d1137);;
  /*background: linear-gradient(135deg, #0a0347, #3c298f);*/ /* känns som om denna bakgrunden inte är den bästa? */
  padding: 2%;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
}
h2 {
  font-size: 2em;
  margin: 0.5em;
  color: #ff6f00;
  text-transform: uppercase;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}
button {
  align-items: center;
  background-image: linear-gradient(135deg, #fF6E00 40%, #FF8800);
  border: 1%; 
  border-radius: 10px;
  border-color: #FF8800;
  color: #eae9e9;
  cursor: pointer;
  font-size: 100%;
  font-weight: 700;
  padding: 2%;
  text-transform: uppercase;
}
button:disabled {
  cursor: not-allowed;
  background-image: linear-gradient(135deg, #a9632d 40%, #bd782a); /* kanske ändra färg här? */
  border-color: #bd782a;
  color: #a38d7c
  /* denna ska bli typ grå för att visa + ingen cursor */
}
button:hover:enabled {
  background-image: linear-gradient(135deg, #fF6E00 40%, #FF8800);
  border-color: #bd782a;
  color: #d6b79f
}
</style>