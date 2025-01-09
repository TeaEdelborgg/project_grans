<template>
  <div class="player-background">
    <div class="playerView">
      <div id="upperHalf">
        <div class="player-statistics">
        <div class="player-hearts"> Liv:
          <img :src="this.userStats.information.lives>=1 ? '/img/hjartaRod.png':'/img/hjartaGro.png'" class="heart">
          <img :src="this.userStats.information.lives>=2 ? '/img/hjartaRod.png':'/img/hjartaGro.png'" class="heart">
        </div>
        <div class="player-time">Tid: {{ this.userStats.information.time }} sekunder </div>
      </div>
      </div>

      </div>
      <div  > <!--v-if="questionActive || seeAlternatives", class="answeralternatives"-->
        <QuestionComponent 
          ref="questionComponent" 
          v-bind:question="question" 
          v-bind:questionActive="questionActive"
          v-bind:isCorrectAnswer="isCorrectAnswer"
          v-bind:showCorrectAnswer="showCorrectAnswer"
          v-bind:percentage="percentage"
          v-bind:seeAlternatives="seeAlternatives"
          v-on:answer="submitAnswer($event)"/>
      </div>
      <div id="bottomHalf">
        <div class="help-buttons" >  <!--v-if="questionActive || seeAlternatives"-->
        <img src="/img/50-50.png" class="fifty-fifty" @click="fiftyFifty" v-if="!this.userStats.information.usedFiftyFifty || !usedFiftyFiftyThisRound">
        <img src="/img/50-50-used.png" class="fifty-fifty-used" v-else />
        <img src="/img/AskAudience.png" class="ask-audience" @click="askAudience" v-if="!this.userStats.information.usedAskAudience || !usedAskAudienceThisRound"/>
        <img src="/img/AskedAudience.png" class="ask-audience-used" v-else/> <!-- varför funkar inte detta? -->
        <!-- frågan är om man vill ha denna som en popup eller ska den lysa upp en knapp som nu? -->
      </div>
      </div>
    </div>
</template>

<script>
// @ is an alias to /src
import QuestionComponent from '@/components/QuestionComponent.vue';
import io from 'socket.io-client';
const socket = io(sessionStorage.getItem("dataServer"))

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
      questionNumber: null,
      isCorrectAnswer: false, // kollar om svaret som skickats är korrekt eller inte
      questionActive: false, // om den fortfarande syns på stora tavlan
      seeAlternatives: false, // om man kan se sina svar när man inte kan svara på frågan, ska detta finnas hela tiden? kanske
      timeLeft: 0, 
      showCorrectAnswer: false, // rättar och gör knappen grön om korrekt, annars röd
      percentage: 100,
      isQuestionAnswered: false, 
      usedFiftyFiftyThisRound: false,
      usedAskAudienceThisRound: false,
    }
  },
  created: function () {
    this.pollId = this.$route.params.id;
    this.userId = this.$route.params.userId;
    socket.on( "uiLabels", labels => this.uiLabels = labels );
    
    socket.on('sendPlayerStats', user => {
      const stats = user
      if (stats.userId == this.userId) {
        this.userStats = user 
      }
      
    })

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
    fiftyFifty: function() { // lägg in så bara körs om questionActive
      if (this.questionActive) {
        socket.emit('fiftyFifty', {pollId: this.pollId, questionNumber: this.questionNumber, userId: this.userId})
        this.usedFiftyFiftyThisRound = true
      }
      
    },
    askAudience: function() {
      if (this.questionActive) {
        socket.emit('audienceAnswer', {pollId: this.pollId, questionNumber: this.questionNumber, userId: this.userId, usedFiftyFifty: this.usedFiftyFiftyThisRound})
        this.usedAskAudienceThisRound = true
      }
    },
    submitAnswer: function (answer) { 
      socket.emit("submitAnswer", {pollId: this.pollId, questionNumber: this.questionNumber, answer: answer, userId: this.userId, time: Math.ceil(this.timeLeft/1000)}) 
      this.isQuestionAnswered = true;
      this.usedFiftyFiftyThisRound = false;
      console.log('frågan är besvarad')
    },
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
            this.seeAlternatives = true;
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

<style scoped>
#bottomHalf{
  width: 100%;
  background-color: black;
  height: 20%;
  position: absolute;
  bottom: 0;
}
#upperHalf{
  width: 100%;
  background-color: black;
  height: 20%;
  position: absolute;
  top: 0;
  z-index: 3;
}
.player-background {
  background-color: #001F3F;
  color: #FFFFFF;
  position: fixed;
  width: 100%;
  height: 100%;
}
.player-statistics {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2%;
  padding: 2%;
  height: 50%;
  background-color: black;
}
.player-hearts {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 5vw 0 5vw;
}
.heart {
  height: 5vh;
  margin: 5%;
}
.player-time {
  border: 2px solid #cdcdcd;
}
.help-buttons {
  display: flex;
  justify-content: center;
  align-items: center;
}
.fifty-fifty {
  height: 5vh;
  margin: 5%;
  border: 5px solid #cdcdcd;
  border-radius: 50%;
}
.fifty-fifty-used {
  height: 5vh;
  margin: 5%;
  border: 5px solid #555;
  border-radius: 50%;
}
.ask-audience {
  height: 5vh;
  margin: 5%;
  border: 5px solid #cdcdcd;
  border-radius: 50%;
}
.ask-audience-used {
  height: 5vh;
  margin: 5%;
  border: 5px solid #555;
  border-radius: 50%;
}
</style>