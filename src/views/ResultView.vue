<template>
  <div id="background">
    <div>
      lang: {{ lang }}
    </div>
    
    <!--<BarsComponent v-bind:labels="question.a" v-bind:data="submittedAnswers"/>-->
    <QuestionComponentResult v-if="questionActive" v-bind:progress="percentage" v-bind:question="question"  ></QuestionComponentResult> <!--Lägg till questionId senare-->
    <BeforeQuestionComponent v-if="beforeQuestion" v-bind:timeLeft="timeLeftBeforeQuestion" ></BeforeQuestionComponent>
    <div id="players">
      <!-- Lägg in componenter för varje steg för priset -->
      <div id="contain">
        <Player v-if="participants.length>0" v-for="player in participants" v-bind:player="player" :key="player.id" id="player"/>
      </div>
    </div>
    
    <br>
    <div id="pedestaler">
          <PlayerPedestal v-show="participants.length>0" v-for="player in participants" v-bind:player="player" :key="player.id" class="pedestal"/>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import BarsComponent from '@/components/BarsComponent.vue';
import Player from '@/components/Player.vue';
import PlayerPedestal from '@/components/PlayerPedestal.vue';
import io from 'socket.io-client';
import QuestionComponentResult from '@/components/QuestionComponentResult.vue';
import BeforeQuestionComponent from '@/components/BeforeQuestionComponent.vue';
const socket = io("localhost:3000");

export default {
  name: 'ResultView',
  components: {
    BarsComponent,
    Player,
    PlayerPedestal,
    QuestionComponentResult,
    BeforeQuestionComponent
  },
  data: function () {
    return {
      lang: localStorage.getItem("lang") || "en",
      pollId: "",
      //question: {q: " ", answers: []}, //ändra så att question bara är tomt
      question:"",
      submittedAnswers: {},
      participants: [],
      timeLeft:0,
      timeLeftBeforeQuestion:0,
      questionActive:false,
      beforeQuestion:false,
      windowHeight:0,
      windowWidth:0,
      percentage:100,
      amountOfQuestions:0,
    }
  },
  created: function () {
    this.pollId = this.$route.params.id
    socket.on( "uiLabels", labels => this.uiLabels = labels );
    //socket.on("submittedAnswersUpdate", update => this.submittedAnswers = update);
   //behlver inte tror jag socket.on("questionUpdateResult", update => this.question = update );
    socket.on( "participantsUpdate", p => {
      
      this.participants = p;})
    //socket.on("startFirstTimer", this.TimerBeforeQuestion())
    //socket.on('getTime',time =>this.timeLeft=time);
    //socket.on('getTimeBeforeQuestion',timeTwo => this.timeLeftBeforeQuestion=timeTwo);

    //dessa två vill jag ej ha
    
    /*socket.on('startTimerBeforeQuest', () =>{this.beforeQuestion=true;
      console.log("försöker starta timer")
    });
    socket.on('startTimer', () =>{
      this.beforeQuestion=false;
      this.questionActive=true;
      console.log("försöker starta timer")
    });*/
    //socket.on("checkedAnswer", answers => this.checkedAnswers = answers);

    //behöver mängden frågor

    socket.on('startCountdownResults', question =>{
      this.question=question;
      this.countdownResult();
    });
    socket.on('sendAmountQuestions', value => {this.amountOfQuestions=value
      console.log("antal frågor: ",value)
    })

    socket.emit( "getUILabels", this.lang );
    socket.emit( "joinPoll", this.pollId );
    socket.emit("updateResult", this.pollId);
    

  },
  mounted (){
    socket.emit('getAmountQuestions', this.pollId);

    this.windowHeight = document.documentElement.clientHeight
    this.windowWidth = document.documentElement.clientWidth;
    const backgroundResult = document.getElementById('background');
    backgroundResult.style.width=this.windowWidth +"px";
    backgroundResult.style.height=this.windowHeight + "px";
  },
  methods:{
    countdownResult: function(){
      let startTime = Date.now();

      let timerDuration = 13000;
      let timerAnswer = 10000;
      
      let interval = setInterval(() =>{
        //behöver skicka tiden till komponenterna
        let elapsedTime = Date.now() - startTime;
        let timeLeftTest = timerDuration - elapsedTime;

        if (timeLeftTest > timerAnswer) {
          this.beforeQuestion = true
          this.timeLeftBeforeQuestion = Math.floor((3000 - elapsedTime)/1000);
        } else if (timeLeftTest > 0) {
          this.beforeQuestion = false
          this.questionActive = true;
          this.percentage = Math.floor(timeLeftTest / 100);
          console.log('Procent kvar: ', this.percentage, Math.floor(timeLeftTest / 10000))
        } else {
          this.questionActive=false
          clearInterval(interval)
          console.log('Resultatview, interval clear')
          this.percentage =100
        }
      }, 100);  
    },
    


  }
}
</script>

<style>
#pedestaler{
  width:80%;
  display: flex;
  justify-content: space-evenly;
  height:200px;
  background-color: grey;
  margin:auto;
}
.pedestal{
  flex:1;
 max-width: 10%;
  height:100px;
  margin:auto;
}
#players{
  width:80%;
  display: flex;
  justify-content: space-evenly;
  height:400px;
  background-color: aquamarine;
  margin: auto;
}
#player{
  flex:1;
  max-width: 80%;
  background-color: white;
  height: 300px;
  margin:5px
}
#contain{
  width: 80%;
  display: flex;
  margin:auto
}
#background{
  background-color: wheat;
  position: fixed;
  z-index: 1;
}
#questionFrame{
    height: 400px;
    width: 80%;
    margin:auto;
    background-color: white;
    position: absolute;
    z-index: 3;
}
#backgroundFrame{
    height: 100%;
    width: 100%;
    opacity: 0.5;
    position: absolute;
    z-index: 2;
    background-color: black;
}
#windowContainer{
    height: 100%;
    width: 100%;
    position: relative;
}


</style>
