<template>
  <div id="playerview">
  <!--<div id="bars">-->
    <SliderCompoment @sendAnswer="submitAnswer()"
        v-bind:sent="sent"
        v-bind:seeAlternatives="seeAlternatives"
        v-bind:questionActive="questionActive"/>
  <!--</div>-->
      <!-- <div id="bars" @mousedown="pressedDown" @touchstart="pressedDown"></div> -->
      <!-- gör denna till egen komponent sen, slidercomponent-->


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
      <!--
      <button class="answeralternative" 
        :class="{ 
          selected: a === selectedAnswer, 
          sended: a === selectedAnswer && sent, 
          showCorrect: a === selectedAnswer && showCorrectAnswer && isCorrectAnswer, 
          showIncorrect: a === selectedAnswer && showCorrectAnswer && !isCorrectAnswer, 
          showAudienceAnswer: a === audienceAnswer,
        }"        
        v-for="a in question.a" 
        v-on:click="selectAnswer(a)" 
        v-bind:key="a"
        :disabled="isDisabled(a)">
        {{ a }}
      </button> <br/>-->
    </div>
    
    
    <!--<button class="submitbutton" v-on:click="answer">
      Submit answer
    </button>-->
    
    <!--<div id="slidercontainer">
        <SliderCompoment @sendAnswer="answer"/>
      </div>-->
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
      selectedAnswer:'',
      sent:false,
      fiftyFify: [],
      audienceAnswer:'',

      //till slidern:
      // placePressed: 0,
      // pressed: false,
      // sliderOffsetLeft: 0, // Håller reda på var slidern börjar
      // maxPosition: 0, // Maximal position för slidern
      // minPosition: 0, // Minimal position för slidern
      // heightPx:0,
      // topPosition: 0, 
      // bottomPosition: 0,
      // currentPlace:0,
      // maxBottom:0,

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
      this.question = question.q; // ger frågan och random order på svaren
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
      this.isQuestionAnswered = true;
      this.usedFiftyFiftyThisRound = false;
      console.log('frågan är besvarad, svaret är: ', this.selectedAnswer)
    },
    countdownPlayer: function() {
      console.log('kör countdownPlayer')
      this.sent=false;
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
    //gallret
    // pressedDown: function(e){
    //         console.log("i pressedDown")
    //         if(!this.sent && this.seeAlternatives){
    //             //console.log(e.clientX)
    //             if(e.type=="touchstart"){
    //                 e.preventDefault();
    //                 this.placePressed = e.touches[0].clientY
    //             }
    //             else{
    //                 this.placePressed = e.clientY;
    //             }
    //             this.pressed = true;
    //             window.addEventListener("mousemove",this.move) //inte this.move() för då kallar den inte konstant
    //             window.addEventListener("mouseup", this.mouseReleased)
    //             window.addEventListener("touchmove",this.move)
    //             window.addEventListener("touchend", this.mouseReleased)
    //         }
    //     },
    //     move: function(e){
    //         console.log("i move")
    //         let bar = document.getElementById("bars")
    //         if(bar){
    //             if(e.type =="touchmove"){
    //                 this.currentPlace = e.touches[0].clientY;
    //             }
    //             else{
    //                 console.log("y pos: ", e.clientY)
    //                 this.currentPlace = e.clientY
    //             }
    //             const barRect = bar.getBoundingClientRect();
    //             this.topPosition = barRect.top;
    //             this.bottomPosition = barRect.bottom;
    //             console.log("top: ", this.topPosition, " bottom: ", this.bottomPosition)

    //             if(this.pressed){
    //                 let movedPlaced = this.currentPlace-this.placePressed
    //                 if (movedPlaced < 0){
    //                     bar.style.top='-90%'; //0+'px'
    //                 }
    //                 else if (this.bottomPosition > this.maxBottom){
    //                     bar.style.bottom = '0';//;(this.maxPosition - (this.bottomPosition-this.topPosition))+'px'
    //                   }
    //                 else{
    //                     bar.style.top = -90+((this.currentPlace-this.placePressed)/this.heightPx)*100+'%';;// //-this.placePressed då vi vill ha den i sliderBox och inte på hela sidan
    //                 }    
    //             }
    //             else{
    //                 return 0
    //             }
    //         }  
    //     },
    //     mouseReleased: function(e){
    //       let bar = document.getElementById("bars")
    //       this.pressed = false;
    //         if(bar){
    //             //console.log("mouse släppt")
    //             //fick massa fel när jag hade removeeventlistener här, och frågetecknen
    //             if (this.bottomPosition >= this.maxBottom) {
    //                 bar.style.bottom='0'//slider.style.right = (this.maxPosition - (this.rightPosition-this.leftPosition))+'px';
    //                 bar.style.top='0'
    //                 this.sent = true;
    //                 this.sendAnswer();
    //             } else {
    //                 console.log("else")
    //                 bar.style.top = '-90%';
    //             }
    //         }
    //         document.removeEventListener("mousemove",this.move)
    //         document.removeEventListener("mouseup", this.mouseReleased)
    //         document.removeEventListener("touchmove",this.move)
    //         document.removeEventListener("touchend", this.mouseReleased)
    //     },
    //     //gör funktion som skriver hej, ska köras när den släpps på 100%
    //     //slidern ska också då fastna på 100% och man kan inte längre flytta den
    //     //annars ska den hamna på start igen
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
//ha en "selected button, så om en knapp trycks på så väljs den knappen till selected, den ändrar också färg?"
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