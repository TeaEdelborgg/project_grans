<template>
    <button v-on:click="runQuestion" :disabled=!canStartNextQuestion> 
      <!-- lägga in om sista frågan så kan man ej klicka på denna utan den byts ut till finish game?-->
      Run question
    </button> <br><br>
    <router-link v-bind:to="'/result/' + pollId">Check result</router-link>
    <button v-on:click="finishGame()">Finish Game</button>
    <!--<router-link v-bind:to="'/finalResult/' +pollId">Finish Game</router-link> ska skicka resultatview till finalResult-->
    <br><br>

    <!--<br><br>
    <button v-on:click='testFunktion'>
      Testknapp
    </button><br><br>-->

    <!-- Data: <br> 
    {{ pollData }} <br><br>-->

    Antal svar inkommna: {{ numberPlayersAnswered }}/{{ numberPlayers }}

    <br>
    nuvarande fråga: 
    {{ this.pollData.currentQuestion }} <br><br>

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
//const socket = io("localhost:3000");
const socket = io(sessionStorage.getItem("dataServer")) //for mobile phones osv

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
      //timeLeft:0,
      //timeLeftBeforeQuestion:0,


      //timeLeftTest:0, // ta bort sen?
    }
  },
  created: function () {
    this.pollId = this.$route.params.id;


    socket.on( "uiLabels", labels => this.uiLabels = labels );
    socket.on( "pollData", data => {
      //console.log('polldata socketen körs i admin')
      this.pollData = data; 
      this.getQuestions();
      this.getCorrectAnswers();
      this.getNumberPlayers();
    });
    socket.on("participantsUpdate", (p) => {
      //console.log('participantsUpdate socketen körs i admin')
      this.pollData.participants = p 
      this.getnumberPlayersAnswered();
    });
    socket.emit("joinPoll", this.pollId);
    socket.emit( "getUILabels", this.lang );
    socket.on('currentQuestionUpdate', (questionNumber) => {
      this.pollData.currentQuestion = questionNumber
    })


    //socket.on("checkedAnswer", answers => this.checkedAnswers = answers);
    /*socket.on('getTime',time => {this.timeLeft=time
      console.log("tog emot tid")
    });*/
    //socket.on('getTimeBeforeQuestion',timeTwo => this.timeLeftBeforeQuestion=timeTwo);
    socket.on('scoreBoardCreated', ()=>{
      socket.emit('finishGame', this.pollId)
    })
    socket.emit("updateResult", this.pollId)
    /*socket.on('canStartNextQuestion', ()=> { // denna funkar inte riktigt...
      console.log('kör socketen i admin')
      this.canStartNextQuestion = true
    })*/

  },
  methods: {
    testFunktion: function() {
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
            this.canStartNextQuestion = true // måste tas bort sen när jag löst så detta ställs om med socketen
            // sätta timern till noll här också? så att den inte körs över till nästa fråga??
          }
        }
      }
    },
    runQuestion: function () {
      this.canStartNextQuestion = false
      const currentQuestion = this.pollData.currentQuestion + 1;
      this.numberPlayersAnswered = 0
      //console.log('i run question, nuvarande fråga: ', currentQuestion)
      //socket.emit("startTime",{pollId:this.pollId, time:10})
      //socket.emit("startTimeBeforeQuestion",{pollId:this.pollId, time:3}) //alla ska starta deras egna, samtiidgt som vi har en på servern

      //ny socket
      socket.emit('runCountdown', {pollId: this.pollId, questionNumber: currentQuestion})

      //this.timerBeforeQUestion()
      //this.testCountdown()
      //här måste timer köras för 
    },
    finishGame: function(){
      //här scoreboard skapas
      socket.emit('createScoreBoard', this.pollId)
      // hur kan jag göra så att alla spelare ect försvinner? måste läggas in här så man kan köra om spelet här
    },
    /*generatePollId: function(){
      return Math.random().toString(36).substring(2,10).toUpperCase();
      //id ska tas bort om det genererats tidigare?
    },*/

    /*createPoll: function () {
      this.pollId=this.generatePollId();
      socket.emit("createPoll", {pollId: this.pollId, lang: this.lang })
      socket.emit("joinPoll", this.pollId);
    },*/
    /*startPoll: function () { // används inte nu men kanske ska göra det??
      //this.timerQuestion()
      socket.emit("startPoll", this.pollId)
    },*/
    /*timerBeforeQUestion: function(){ //denna ska göra så att resultat också får count down
        let time={
          timeLeft:3,
          interval:null
        }
        time.interval = setInterval(()=>{
          if (time.timeLeft>0){
            time.timeLeft--;
            console.log("tiden innan fråga, ", time.timeLeft)
            socket.emit("getTimerBeforeQuestion",this.pollId)
          } else {
            socket.emit("startTime",{pollId:this.pollId, time:10})
            socket.emit("runQuestion", {pollId: this.pollId, questionNumber: this.questionNumber})
            this.timerQuestion();
            clearInterval(time.interval)
          }
        },1000);
    },*/
    /*timerQuestion: function (){ //resultat ska få denna också
        let time ={
          timeLeft:10,
          interval:null
        }
        time.interval = setInterval(()=>{
          if (time.timeLeft>0){
            time.timeLeft--;
            console.log("tiden i create ",time.timeLeft)
            socket.emit("getTimer",this.pollId)
          } else{
            console.log("tiden uppe i timerQuestion")
            socket.emit("timesUp",this.pollId)
            this.timeLeft=0
            clearInterval(time.interval)
            //här vill man göra så att alla personer skickar deras svar för att checkas, annars kan man titta under spelets gång 
          }
        },1000);
    },*/

    /*testCountdown: function() { // ta bort denna och lägg in en socket som lyssnar när timern är slut på resultatsidan
      let startTime = Date.now();

      let timerDuration = 13000;
      let timerAnswer = 10000;
      
      let interval = setInterval(() =>{
        let elapsedTime = Date.now() - startTime;
        let timeLeftTest = timerDuration - elapsedTime;

        if (timeLeftTest > timerAnswer) {
          console.log('test, tid innan frågan: ', timeLeftTest - timerAnswer)
        } else if (timeLeftTest > 0) {
          // console.log('test, tid kvar för att svara: ', timeLeftTest)
        } else {
          clearInterval(interval)

          console.log('test, interval clear')
        }
      }, 1000);  
    }, */
  }
}
</script>