<template>
    <input type="number" v-model="questionNumber">
    <button v-on:click="runQuestion">
      Run question
    </button>
    <router-link v-bind:to="'/result/' + pollId">Check result</router-link>
    <button v-on:click="finishGame()">Finish Game</button>
    <!--<router-link v-bind:to="'/finalResult/' +pollId">Finish Game</router-link> ska skicka resultatview till finalResult-->
    <br>
    Data: {{ pollData }}
    CheckedAnswers: {{ checkedAnswers }} <br>
    Time Left:{{ timeLeft }}, Time Left Test: {{ timeLeftTest }}<br>
    Time before Question:{{ timeLeftBeforeQuestion }}
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
      question: "",
      answers: {},
      correctAnswer: "",
      wrongAnswers: ["", "", ""],
      questionNumber: 0,
      pollData: {
        questions: []
      },
      uiLabels: {},
      checkedAnswers: {},
      timeLeft:0,
      timeLeftBeforeQuestion:0,


      timeLeftTest:0,
    }
  },
  created: function () {
    this.pollId = this.$route.params.id;


    socket.on( "uiLabels", labels => this.uiLabels = labels );
    socket.on( "pollData", data => this.pollData = data );
    socket.on( "participantsUpdate", p => this.pollData.participants = p );
    socket.emit( "getUILabels", this.lang );
    socket.on("checkedAnswer", answers => this.checkedAnswers = answers);
    socket.on('getTime',time => {this.timeLeft=time
        console.log("tog emot tid")
    });
    socket.on('getTimeBeforeQuestion',timeTwo => this.timeLeftBeforeQuestion=timeTwo);
    socket.emit("updateResult", this.pollId)

  },
  methods: {
    generatePollId: function(){
      return Math.random().toString(36).substring(2,10).toUpperCase();
      /*id ska tas bort om det genererats tidigare?*/
    },
    createPoll: function () {
      this.pollId=this.generatePollId();
      socket.emit("createPoll", {pollId: this.pollId, lang: this.lang })
      socket.emit("joinPoll", this.pollId);
    },
    startPoll: function () { 
      //this.timerQuestion()
      socket.emit("startPoll", this.pollId)
    },
    timerBeforeQUestion: function(){ //denna ska göra så att resultat också får count down
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
    },
    timerQuestion: function (){ //resultat ska få denna också
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
    },

    testCountdown: function() {
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
      //socket.emit("startTime",{pollId:this.pollId, time:10})
      socket.emit("startTimeBeforeQuestion",{pollId:this.pollId, time:3}) //alla ska starta deras egna, samtiidgt som vi har en på servern

      //ny socket
      socket.emit('runCountdown', {pollId: this.pollId, questionNumber: this.questionNumber})

      this.timerBeforeQUestion()
      this.testCountdown()
      //här måste timer köras för 
    },
    finishGame: function(){
      socket.emit('finishGame', this.pollId)
    }
  }
}
</script>