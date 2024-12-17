<template>
  <div id="background">
    <div id="playerView">
      <div id="timerBarContainer">
        <div id="timerBar" :style="{ width: percentage + '%' }"></div>
      </div>
      <div>
        <p>Tid:  sekunder, Liv kvar: </p>
      </div>
      

      <div class="answeralternatives" v-if="questionActive || seeAlternatives">
        <QuestionComponent 
          ref="questionComponent" 
          v-bind:question="question" 
          v-bind:questionActive="questionActive"
          v-bind:checkedAnswer="checkedAnswer"
          v-bind:showCorrectAnswer="showCorrectAnswer"
          v-on:answer="submitAnswer($event)"/>
      </div>
      <span>{{submittedAnswers}}</span>
      Checked answer {{ checkedAnswer }}
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import QuestionComponent from '@/components/QuestionComponent.vue';
import io from 'socket.io-client';
const socket = io("localhost:3000");

export default {
  name: 'PollView',
  components: {
    QuestionComponent,
  },
  data: function () {
    return {
      userId:'',
      question: {
        q: "",
        a: []
      },
      pollId: "inactive poll",
      submittedAnswers: {},
      questionRandom:{
        q:"",
        a:[]
      },
      questionNumber: null,
      checkedAnswer: false, // kollar om svaret som skickats är korrekt eller inte
      questionActive: false, // om den fortfarande syns på stora tavlan
      seeAlternatives: false, // om man kan se sina svar när man inte kan svara på frågan, ska detta finnas hela tiden? kanske
      answerChecked: false,  // om timeUp ska köras eller inte
      timeLeft: 0, // 
      showCorrectAnswer: false, // rättar och gör knappen grön om korrekt, annars röd
      percentage: 100,
    }
  },
  created: function () {
    this.pollId = this.$route.params.id;
    this.userId = this.$route.params.userId;
    socket.on( "uiLabels", labels => this.uiLabels = labels );
    //socket.emit("getParticipants", this.pollId);


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
    
    socket.on("checkedUserAnswer", checkedAns => {
      this.checkedAnswer = checkedAns;
      //console.log("tagit emot checked Answer: ", checkedAns)
    });
    socket.on("gameFinished", () =>
      this.$router.push("/finalResultPlayer/" + this.pollId + "/" + this.userId)
    );
    
    socket.emit( "getUILabels", this.lang );
    socket.emit( "joinPoll", this.pollId );

    //ny socket till countdown
    socket.on('startCountdownPlayer', question =>{
      this.question=question.q;
      this.questionNumber=question.questionNumber;
      this.countdownPlayer();
    })
  },
  methods: {
    submitAnswer: function (answer) { //här måste correct answer också va med, inte bara answer ?????
      //titta i servern hur tid och svar kopplas, du vill koppla tiden här direkt så att det stämmer med personens 
      //timer och inte servern!!!!
      // ska skickas som [svaret de valt, tid kvar], kolla i data
      // kolla så att allt som varit koppat till serven fortfarande är det
      socket.emit("submitAnswer", {pollId: this.pollId, answer: answer, userId: this.userId, time: Math.floor(this.timeLeft/1000)}) // ta bort correctAnswer
      console.log('svaret skickas')
    },
    timeUp: function(){
      socket.emit("checkUserAnswer", {pollId:this.pollId, questionNumber:this.questionNumber,userId:this.userId}) //den ska sedan vara när timern går ut
      console.log('timeUp körs')
    }, 
    countdownPlayer: function() {
      this.answerChecked = false;
      this.checkedAnswer = false;
      this.seeAlternatives = false;
      this.showCorrectAnswer = false;
      this.percentage = 100;

      let startTime = Date.now();

      let timerDuration = 16000;
      let timerAnswer = 10000;
      let timerSeeAnswer = 3000;
      
      let interval = setInterval(() =>{
        let elapsedTime = Date.now() - startTime;
        this.timeLeft = timerDuration - elapsedTime;

        if (this.timeLeft > timerAnswer + timerSeeAnswer) {
          //console.log('PollView, tid innan frågan: ', this.timeLeft - timerAnswer - timerSeeAnswer)
        } else if (this.timeLeft > timerSeeAnswer) {
          this.percentage = Math.floor((this.timeLeft - timerSeeAnswer) / 100); //denna går inte ner till noll?
          this.questionActive = true;
          //console.log('PollView, tid kvar för att svara: ', this.timeLeft - timerSeeAnswer)
        } else if (this.timeLeft > 0) { // denna körs flera gånger? hur ska man göra så att den inte gör det?
          this.questionActive = false
          this.seeAlternatives = true
          //console.log('Pollview, kolla och se vad man svarat')
          if (!this.answerChecked) {
            console.log('checked answer innan: ', this.checkedAnswer)
            this.timeUp()
            this.answerChecked = true
            console.log('checked answer efter: ', this.checkedAnswer)
          }
        } else {
          this.showCorrectAnswer = true;
          clearInterval(interval)
        }
      }, 100);  
    },
  },
  // lägg till computed där vi hämtar userId


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
  background-color: yellow;
  transition: width 0.1s linear;
}
</style>