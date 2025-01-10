<template>
  <div id="playerview">
    <SliderCompoment @sendAnswer="submitAnswer()"
        v-bind:sent="sent"
        v-bind:seeAlternatives="seeAlternatives"
        v-bind:questionActive="questionActive"/>
    <div id="container" v-if="questionActive || seeAlternatives" class="answeralternatives"> <!-- v-if="questionActive || seeAlternatives" class="answeralternatives"-->
      <div class="timerBarContainer">
        <div class="timerBar" :style="{ width: percentage + '%' }"></div>
      </div>
      <div id="answersContainer">
        <div v-for="a in question.a" class="containerButton">
          <div class="line"></div>
          <div class="borderRect">
            <button class="rectangle" :class="{ 
            selected: a === selectedAnswer, 
            sended: a === selectedAnswer && sent, 
            showCorrect: a === selectedAnswer && showCorrectAnswer && isCorrectAnswer, 
            showIncorrect: a === selectedAnswer && showCorrectAnswer && !isCorrectAnswer, 
            showAudienceAnswer: a === audienceAnswer,
            }"      
            v-on:click="selectAnswer(a)" v-bind:key="a" :disabled="isDisabled(a)">
              {{ a }}
            </button>
          </div>
          
        </div>
      </div>
    </div>
  </div>
  
</template>

<script>
import SliderCompoment from './SliderCompoment.vue';
import io from 'socket.io-client';
const socket = io(sessionStorage.getItem("dataServer"))

export default {
  name: 'QuestionComponent',
  components: {
    SliderCompoment
  },
  props: {
    userId: String,
    pollId: String,
  },
  data: function(){
    return{
      selectedAnswer:null,
      sent:false,
      fiftyFify: [],
      audienceAnswer:'',

      //till för countdownen
      question: {
        q: "",
        a: []
      },
      questionNumber: null,
      questionActive: false, 
      isQuestionAnswered: false, 
      isCorrectAnswer: false,
      showCorrectAnswer: false, 
      seeAlternatives: false, 
      percentage: 100,
      timeLeft: 0, 
      }
  },
  created: function () {
    //socket.emit( "getUILabels", this.lang ); tror ej denna behövs
    socket.emit( "joinPoll", this.pollId );

    socket.on('startCountdownPlayer', question =>{
      console.log('startCountdown körs: ', question)
      this.question = question.q; 
      this.questionNumber = question.questionNumber;
      this.countdownPlayer();
    })

    socket.on('sendFiftyFifty', incorrects => {
      if (incorrects.user == this.userId) {
        this.fiftyFify = incorrects.answers
        console.log('läser in sendFiftyFifty', this.fiftyFify)
      }
    })

    socket.on('sendAudienceAnswer', audienceAnswer => {
      if (audienceAnswer.user == this.userId) {
        this.audienceAnswer = audienceAnswer.answer
        console.log('läser in publikens svar', this.audienceAnswer)
      }
    })
  },
  emits: ["answer"],
  methods: {
    selectAnswer: function(answer){
      if (this.questionActive && !this.sent) {
        console.log('selectanswer: ', answer)
        this.selectedAnswer = answer
      }
    },
    isDisabled: function (a){
      if (this.fiftyFify.length > 0) {
        for (let i=0; i < 2; i++) {
          if (a == this.fiftyFify[i]){
            return true
          }
        } 
        return false
      }
    },
    submitAnswer: function () {
      socket.emit("submitAnswer", {pollId: this.pollId, questionNumber: this.questionNumber, answer: this.selectedAnswer, userId: this.userId, time: Math.ceil(this.timeLeft/1000)}) 
      this.usedFiftyFiftyThisRound = false;
      this.isQuestionAnswered = true;
      console.log('frågan är besvarad, svaret är: ', this.selectedAnswer)
    },
    countdownPlayer: function() {
      console.log('kör countdownPlayer')
      this.sent=false;
      this.selectedAnswer=null;
      this.isCorrectAnswer = false;
      this.seeAlternatives = false;
      this.showCorrectAnswer = false;
      this.isQuestionAnswered = false;
      this.percentage = 100;

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
          // lägg in en countdown för innan frågan
        } else if (this.timeLeft > timerAnswer) {
          // läs frågan på skärmen
        } else if (this.timeLeft > 0) {
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
      }, 100);  
    },
  },
  mounted(){
    this.sent=false
    let playerview = document.getElementById("playerview");
    const playerviewRect = playerview.getBoundingClientRect();
    this.heightPx = playerviewRect.bottom-playerviewRect.top;
    this.minPosition='0%'
    this.maxPosition='100%'
    this.maxBottom = playerviewRect.bottom
  }
}
</script>

<style scoped>
#bars{
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: url('/img/bars2.png');
  background-size: cover;
  background-position: center;
  top:-90%;
  z-index: 2;
}
#container{
  top:10%;
  position: absolute;
  height: 90%;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
}
.answeralternative {
  background-color: #f79743;
  border-color: #FFAD66;
  border-style: solid;
  color: #FAF8F1;
  border-radius: 1em;
  margin: 2vh 2vw;
  width: 35vw;
  height: 20vh;
}
#answersContainer{
  bottom:0;
  width: 100%;
  height: 93%;
  display: grid;
  grid-template-columns: 50% 50%;
  grid-template-rows: 50% 50%;
  grid-row: auto auto;
  justify-content: center;
  position:absolute;
  margin: auto;
  animation: showAnswers 0.5s;
}
.line{
  height: 2px;
  width: 100%;
  background-color: lightyellow;
  box-shadow: 0 0 5px lightyellow;
}
.containerButton{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
}
.rectangle{
  width: 100%;
  height: 100%;
  /*background: linear-gradient(#393a93, #7bb0f3, #393a93); */
  background-color: #101c3e;
  color:white;
  clip-path: polygon(15% 0%, 85% 0%, 100% 50%, 85% 100%, 15% 100%, 0% 50%);
  align-content: center;
  justify-content: center;
  position: relative;
  
}
.borderRect{
  clip-path: polygon(15% 0%, 85% 0%, 100% 50%, 85% 100%, 15% 100%, 0% 50%);
  border: 2px solid lightyellow;
  position: absolute;
  width: 90%;
  height: 70%;
  background-color: lightyellow;
  box-shadow: 0 0 5px lightyellow;
}
.selected {
  background-color: #FF5700;
  border-color: #FF5700;
  color: white; 
}
.sended {
  background-color: #FFAD66; 
  border-color: #FFAD66;
  color: white; 
}
.showCorrect {
  background-color: #2ECC40; 
  border-color: #2ECC40;
  color: white;
}
.showIncorrect {
  background-color: #FF4136; 
  border-color: #FF4136;
  color: white;
}
.showAudienceAnswer {
  background-color: yellow;
  color: black;
}
.submitbutton {
  width: 80vw;
}
button:disabled {
  background-color: grey;
}
.timerBarContainer {
  width: 95%; 
  /*height: 20px;*/
  height: 5%;
  background-color: white;
  border-radius: 10px;
  overflow: hidden;
  /*margin: 3vh 0;*/
  margin:2%;
  padding: 0; 
  position: relative;
}
.timerBar {
  height: 100%;
  background-color: #FF851B;
  transition: width 0.1s linear;
}
#playerview {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 60%;
  top:20%;
  background: linear-gradient(45deg,#0f131f, #3a3790, #0f131f);
  z-index: 0;
}

</style>