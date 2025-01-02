<template>
    <button v-on:click="runQuestion">
      Run question
    </button> <br><br>
    <router-link v-bind:to="'/result/' + pollId">Check result</router-link>
    <button v-on:click="finishGame()">Finish Game</button>
    <!--<router-link v-bind:to="'/finalResult/' +pollId">Finish Game</router-link> ska skicka resultatview till finalResult-->
    <br>

    <br><br>
    <button v-on:click='testFunktion'>
      Testknapp
    </button><br><br>

    Data: <br> 
    {{ pollData }} <br><br>
    Time Left Test: {{ timeLeftTest }} <br><br>

    <!--test
    <ul class="adminParticipants">
        <li v-for="participant in participants">
          {{ participant.information.name }}
        </li>
      </ul>-->

    <div class='questions'>
      Frågor:
      <ul>
        <!-- Loopar genom frågorna och visar dem -->
        <li v-for="(question, index) in questionList" :key="index">
          {{ question }}
        </li>
      </ul>
    </div>
    <div class='correctanswers'>
      Korrekta svar: 
      <ul>
        <li v-for="(answer, index) in answerList" :key="index">
          {{ answer }}
        </li>
      </ul>
    </div>

    nuvarande fråga: 
    {{ this.pollData.currentQuestion }}

    <div class='participants'>
      Spelare: 
      <ul>
        <li v-for="(answer, index) in pollData.participants" :key="index">
          {{ answer }}
        </li>
      </ul>
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
      questionNumber: "", // ta bort? fixa i html först
      pollData: {},
      uiLabels: {},

      participants: [],
      questionList: [],
      answerList: [],
      //timeLeft:0,
      //timeLeftBeforeQuestion:0,


      timeLeftTest:0, // ta bort sen?
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
    });
    socket.on("participantsUpdate", (p) => {
      //console.log('participantsUpdate socketen körs i admin')
      this.pollData.participants = p 
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

  },
  methods: {
    testFunktion: function() {
      console.log('testfunktion')
      console.log(this.pollData.participants[0].information.answers)
    },
    getQuestions: function() {
      const amountOfQuestions = this.pollData.questionAmount;
      for (let i = 0; i < amountOfQuestions; i++) {
        this.questionList[i] = this.pollData.questions[i].q
      }
    },
    getCorrectAnswers: function() {
      const amountOfQuestions = this.pollData.questionAmount; 
      for (let i = 0; i < amountOfQuestions; i++) {
        this.answerList[i] = this.pollData.questions[i].a.correct
      }
    },
    numberPlayersAnswered: function() {
      console.log('kör numberPlayersAnswered')
      console.log('nuvarade fråga: ', this.pollData.currentQuestion)
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

    testCountdown: function() { // ta bort denna och lägg in en socket som lyssnar när timern är slut på resultatsidan
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
    },
 

    runQuestion: function () {
      const currentQuestion = this.pollData.currentQuestion + 1;
      console.log('i run question, nuvarande fråga: ', currentQuestion)
      //socket.emit("startTime",{pollId:this.pollId, time:10})
      //socket.emit("startTimeBeforeQuestion",{pollId:this.pollId, time:3}) //alla ska starta deras egna, samtiidgt som vi har en på servern

      //ny socket
      socket.emit('runCountdown', {pollId: this.pollId, questionNumber: currentQuestion})

      //this.timerBeforeQUestion()
      this.testCountdown()
      //här måste timer köras för 
    },
    finishGame: function(){
      //här scoreboard skapas
      socket.emit('createScoreBoard', this.pollId)
      
    }
  }
}
</script>