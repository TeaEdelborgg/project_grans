<template>
  <button v-if="pollData.currentQuestion + 1 != pollData.questionAmount" v-on:click="runQuestion" :disabled=!canStartNextQuestion>
    Run question {{ pollData.currentQuestion + 2 }}
  </button> 
  <button v-else v-on:click="finishGame()"> View final scoreboard </button> <br><br>

  <button v-on:click="endQuestion()">
    Avsluta fråga
  </button> <br><br>

  <router-link v-bind:to="'/result/' + pollId">Check result</router-link>
  <button v-on:click="finishGame()">Avsluta spelet</button>
  <br><br>

  {{ pollData }}

  <!--<br><br>
  <button v-on:click='testFunktion'>
    Testknapp
  </button><br><br>-->

  <!-- Data: <br> 
  {{ pollData }} <br><br>-->

  Antal svar inkommna: {{ numberPlayersAnswered }}/{{ numberPlayers }}

  <br>
  nuvarande fråga: 
  {{ this.pollData.currentQuestion + 1 }} <br><br>

  <div class='participantAnswers'>
    spelares svar: 
    <li v-for="(participant, index) in pollData.participants" :key="index">
      {{ participant.information.name }} svarade: {{ participant.information.answers[this.pollData.currentQuestion] }}
    </li>
  </div>

  <!--
  <div class='questions'>
    Frågor:
    <li v-for="(question, index) in questionList" :key="index">
      {{ question }}
    </li>
  </div>
  <div class='correctanswers'>
    Korrekta svar: 
    <li v-for="(answer, index) in answerList" :key="index">
      {{ answer }}
    </li>
  </div>
  -->

  <br><br>

  <div>
    <!-- vilket är bäst? som ovan att göra nya listor som man sparar eller som nedan där man endast hämtar dem? -->
    <li v-for="(answer, index) in pollData.questions" :key="index">
      fråga: {{ answer.q }} <br>
      rätt svar: {{ answer.a.correct }}, fel svar:
      <ul v-for="(wrongAnswer, index) in answer.a.wrong" :key="index">
        {{ wrongAnswer }}
      </ul>
    </li>
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
    }
  },
  created: function () {
    this.pollId = this.$route.params.id;

    socket.on( "uiLabels", labels => this.uiLabels = labels );
    socket.on( "pollData", data => {
      this.pollData = data; 
      //this.getQuestions();
      //this.getCorrectAnswers();
      this.getNumberPlayers();
    });
    socket.on("participantsUpdate", (p) => {
      this.pollData.participants = p 
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
    /*testFunktion: function() {
      console.log('testfunktion')
    },
    getQuestions: function() { // om detta behövs eller ej
      const amountOfQuestions = this.pollData.questionAmount;
      for (let i = 0; i < amountOfQuestions; i++) {
        this.questionList[i] = this.pollData.questions[i].q
      }
    },
    getCorrectAnswers: function() { // // om detta behövs eller ej
      const amountOfQuestions = this.pollData.questionAmount; 
      for (let i = 0; i < amountOfQuestions; i++) {
        this.answerList[i] = this.pollData.questions[i].a.correct
      }
    },*/
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
      // hur kan jag göra så att alla spelare ect försvinner när man kört detta? måste läggas in här så man kan köra om spelet här
    },
  }
}
</script>