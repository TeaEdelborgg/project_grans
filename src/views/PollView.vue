<template>
  <div id="background">
    <div id="playerView">
      <div id="timerBarContainer">
        <div id="timerBar" :style="{ width: percentage + '%' }"></div>
      </div>
      <div>
        <p>Tid: {{ this.userStats.information.time }} sekunder, Liv kvar: {{ this.userStats.information.lives }} </p>
      </div>

      <div class="helpButtons" v-if="questionActive"> <!-- fixa så att denna inte blir mindre/ större hela tiden, eller kanske snarare att man inte ska kunna klicka bara?-->
        <button @click="fiftyFifty" :disabled="this.userStats.information.usedFiftyFifty">
          50/50
        </button>
        <button @click="askAudience" :disabled="this.userStats.information.usedAskAudience">
          Fråga publiken
        </button> <!-- frågan är om man vill ha denna som en popup eller ska den lysa upp en knapp som nu? -->
        
        <!-- se om vi ska ha denna, för basically samma sak som fråga publiken?
        <button @click="phoneAFriend">
          Fråga en kompis
        </button> -->
      </div>
      

      <div class="answeralternatives" v-if="questionActive || seeAlternatives">
        <QuestionComponent 
          ref="questionComponent" 
          v-bind:question="question" 
          v-bind:questionActive="questionActive"
          v-bind:isCorrectAnswer="isCorrectAnswer"
          v-bind:showCorrectAnswer="showCorrectAnswer"
          v-on:answer="submitAnswer($event)"/>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import QuestionComponent from '@/components/QuestionComponent.vue';
import io from 'socket.io-client';
//const socket = io("localhost:3000");
const socket = io(sessionStorage.getItem("dataServer")) //for mobile phones osv

export default {
  name: 'PollView',
  components: {
    QuestionComponent,
  },
  data: function () {
    return {
      userId:'',
      userStats: {information: {time: 0, lives: 2}},
      question: {
        q: "",
        a: []
      },
      pollId: "inactive poll",
      submittedAnswers: {}, // används ej
      questionRandom:{ // används ej
        q:"",
        a:[]
      },
      questionNumber: null,
      isCorrectAnswer: false, // kollar om svaret som skickats är korrekt eller inte
      questionActive: false, // om den fortfarande syns på stora tavlan
      seeAlternatives: false, // om man kan se sina svar när man inte kan svara på frågan, ska detta finnas hela tiden? kanske
      timeLeft: 0, 
      showCorrectAnswer: false, // rättar och gör knappen grön om korrekt, annars röd
      percentage: 100,
      isQuestionAnswered: false, 
      usedFiftyFiftyThisRound: false,
    }
  },
  created: function () {
    this.pollId = this.$route.params.id;
    this.userId = this.$route.params.userId;
    socket.on( "uiLabels", labels => this.uiLabels = labels );
    //socket.emit("getParticipants", this.pollId);
    
    socket.on('sendPlayerStats', user => {
      const stats = user
      if (stats.userId == this.userId) {
        this.userStats = user // alla spelare får allas stats??
        //console.log('i pollview, userId: ', stats.userId)
        //console.log('i pollView user, liv: ', user.information.lives, 'tid: ', user.information.time)
        //console.log('i pollView userStats, liv: ', this.userStats.information.lives, 'tid: ', this.userStats.information.time)
      }
      
    })

    /*socket.on( "questionUpdate", q => { 
      console.log("tog emot fråga, ", q)
      this.question = q; 
      this.$refs.questionComponent.updateSent();              
     }); */
    /*socket.on("randomOrderUpdate", q =>{
      console.log("tog emot ranodm fråga, ",q.q);
      this.question=q.q;
      this.questionNumber=q.questionNumber;
      console.log("tog emot random fråga, ",q.questionNumber)
      //this.$refs.questionComponent.updateSent(); 
    })*/
    
    /*socket.on("timeUp",up =>{
      console.log("tittar om timeUp")
      if(up==true){
        this.timeUp();
      }
    });*/ 
    
    // socket.on( "submittedAnswersUpdate", answers => this.submittedAnswers = answers );
    
    /*socket.on("checkedUserAnswer", checkedAns => {
      this.isCorrectAnswer = checkedAns;
    });*/

    socket.on("gameFinished", () =>
      this.$router.push("/finalResultPlayer/" + this.pollId + "/" + this.userId)
    );
    
    socket.emit( "getUILabels", this.lang );
    socket.emit( "joinPoll", this.pollId );

    socket.on('startCountdownPlayer', question =>{
      this.question=question.q;
      this.questionNumber=question.questionNumber;
      this.countdownPlayer();
    })

    
  },
  methods: {
    fiftyFifty: function() { // ska man köra samma socket kanske..? skicka med en till variabel som beror på vilken funktion man kört
      socket.emit('fiftyFifty', {pollId: this.pollId, questionNumber: this.questionNumber, userId: this.userId})
      this.usedFiftyFiftyThisRound = true
    },
    phoneAFriend: function() {
      console.log('phoneAFriend körs') // svara samma som den första personen som svarat
    },
    askAudience: function() {
      socket.emit('audienceAnswer', {pollId: this.pollId, questionNumber: this.questionNumber, userId: this.userId, usedFiftyFifty: this.usedFiftyFiftyThisRound})
    },
    submitAnswer: function (answer) { 
      socket.emit("submitAnswer", {pollId: this.pollId, questionNumber: this.questionNumber, answer: answer, userId: this.userId, time: Math.ceil(this.timeLeft/1000)}) 
      this.isQuestionAnswered = true;
      this.usedFiftyFiftyThisRound = false;
      console.log('frågan är besvarad')
    },
    /*timeUp: function(){ //används inte längre
      //socket.emit("checkUserAnswer", {pollId:this.pollId, questionNumber:this.questionNumber,userId:this.userId}) //verkar inte behöva den, fungerar avkommenterad
      console.log('timeUp körs')
    }, */
    countdownPlayer: function() {
      this.isCorrectAnswer = false;
      this.seeAlternatives = false;
      this.showCorrectAnswer = false;
      this.percentage = 100;
      this.isQuestionAnswered = false;

      let startTime = Date.now();

      let timerDuration = 18000;
      let timerQuestion = 15000;
      let timerAnswer = 10000;
      let endQuestion = false;
      
      let interval = setInterval(() =>{
        let elapsedTime = Date.now() - startTime;

        if (!endQuestion) {
          this.timeLeft = timerDuration - elapsedTime;
        }
        socket.on('resetTime', () => {
            this.timeLeft = 0
            this.percentage = 0
            endQuestion = true
          })

        if (this.timeLeft > timerQuestion) {
          console.log('gör dig redo för nästa fråga')
          // lägg in en countdown för innan frågan
        } else if (this.timeLeft > timerAnswer) {
          console.log('läs frågan på skärmen')
          // läs frågan på skärmen
        } else if (this.timeLeft > 0) {
          console.log('kan svara på frågan')
          this.seeAlternatives = true
          this.percentage = Math.floor(this.timeLeft / 100);
          this.questionActive = true;
        } else {
          if (!this.isQuestionAnswered) { // frågan är om detta ens behövs??
            this.submitAnswer();
          }
          this.percentage = 0
          this.questionActive = false;

          socket.emit('getPlayer', {pollId: this.pollId, userId: this.userId})
          socket.emit('getCorrectedUserAnswer', {pollId: this.pollId, questionNumber: this.questionNumber, userId: this.userId})
          socket.on('sendCorrectedUserAnswer', checkedUserAnswer => {
            this.isCorrectAnswer = checkedUserAnswer
          });
          this.showCorrectAnswer = true
          setTimeout(() => {
            this.seeAlternatives = false;
            clearInterval(interval);
          }, 2000)
        }
          /*
          if (!this.answerChecked) {
            console.log('hej')
            //console.log('checked answer innan: ', this.answerChecked)
            // en nya socket är som kollar om svaret är sant eller ej 
            //socket.emit("checkUserAnswer", {pollId: this.pollId, questionNumber: this.questionNumber,userId: this.userId});
            this.answerChecked = true
            //console.log('checked answer efter: ', this.answerChecked)
          }
        } else {
          this.showCorrectAnswer = true;
          clearInterval(interval)
        }*/
      }, 100);  
    },
  },


  computed: {
    //låter skärmen vara fixed så att den inte går att scrolla i
    mounted (){
      this.windowHeight = document.documentElement.clientHeight
      this.windowWidth = document.documentElement.clientWidth;
      const backgroundPlayer = document.getElementById('background');
      backgroundPlayer.style.width=this.windowWidth +"px";
      backgroundPlayer.style.height=this.windowHeight + "px";
    },
  }
}
</script>

<style>
#background {
  background-color: #001F3F;
  color: #FFFFFF;
  position: fixed;
  width: 100%;
  height: 100%;
}
#playerView {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;

}

.answeralternatives {
  width: 95%;
} 

#timerBarContainer {
  width: 95%; 
  height: 20px;
  background-color: white;
  border-radius: 10px;
  overflow: hidden;
  margin: 3vh 0;
  padding: 0; 
  position: relative;
}

#timerBar {
  height: 100%;
  background-color: #FF851B;
  transition: width 0.1s linear;
}
</style>