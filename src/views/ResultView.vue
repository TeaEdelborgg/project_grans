<template>
  <div id="background">
    <div> <!--Fixa lang saken, syns inte atm-->
      lang: {{ lang }}
    </div>
    <h1 :style="{color:'white'}">{{ uiLabels.heading}}</h1>
    <BeforeQuestionComponent v-if="beforeQuestion" v-bind:uiLabels="uiLabels" v-bind:timeLeft="timeLeftBeforeQuestion" ></BeforeQuestionComponent>
    <QuestionComponentResult v-if="questionActive" v-bind:progress="percentage" v-bind:question="question"  ></QuestionComponentResult> <!--Lägg till questionId senare-->
      <div id="frame">
        <div id="moneyframe">
          <Moneybox v-for="index in amountOfQuestions" v-bind:boxState="moneyBoxes[index-1]" v-bind:value="moneyValues[index-1]" :id="index"/>
        </div>
        <div id="playersFrame">
          <Player v-if="participants.length>0"  v-for="player in participants" v-bind:player="player" v-bind:amountOfQuestions="amountOfQuestions":key="player.id" />
        </div>
      </div>
    <br>
    <div id="pedestaler">
      <PlayerPedestal v-if="participants.length>0" v-for="player in participants" v-bind:questionNumber="questionNumber" v-bind:uiLabels="uiLabels" v-bind:player="player" v-bind:questionActive="questionActive":key="player.id" class="pedestal"/>
    </div>
  </div>
</template>

<script>
//att göra
//fixa så att pedestalerna hamnar längst ner på sidan, täcker 100% width
//att när frågan körs, så syns pedestalerna

// @ is an alias to /src
import BarsComponent from '@/components/BarsComponent.vue';
import Player from '@/components/Player.vue';
import PlayerPedestal from '@/components/PlayerPedestal.vue';
import io from 'socket.io-client';
import QuestionComponentResult from '@/components/QuestionComponentResult.vue';
import BeforeQuestionComponent from '@/components/BeforeQuestionComponent.vue';
import Moneybox from '@/components/Moneybox.vue';
import { nextTick } from 'vue';
//const socket = io("localhost:3000");
const socket = io(sessionStorage.getItem("dataServer")) //for mobile phones osv

export default {
  name: 'ResultView',
  components: {
    BarsComponent,
    Player,
    PlayerPedestal,
    QuestionComponentResult,
    BeforeQuestionComponent,
    Moneybox
  },
  data: function () {
    return {
      uiLabels: {},
      lang: localStorage.getItem("lang") || "en",
      pollId: "",
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
      userId:'',
      moneyBoxes:[],
      moneyValues:[],
      questionNumber:0
    }
  },
  created: function () {
    //inga refs, skicka istället all data till komponenterna så får beräkningarna göras där
    //gör v-if när man bindar data
    //dra ner på sockets så gott det går
    //se till att alla inte frågar requests osv
    //rensa onödiga variabler
    //döp om + gör det tydligt, 
    //fixa vart css ligger + ta bort onödiga rader
    
    this.pollId = this.$route.params.id
    socket.on( "uiLabels", labels => this.uiLabels = labels );


    socket.on( "participantsUpdate", p => { //den här uppdateras när man har svarat, sedan tittas i pedestalerna om antal svar= currentQuestion
      this.participants = p;
    })

    socket.on("sendAllAnswers", d=>{ //updateAfterQuestion
      this.participants = d.participants //behövs inte om alla svar tittas på direkt när man svarat och skickas tillbaka, eller skickar 
      //participant update när svaren har rättats
      this.moneyBoxes = d.levelBoxes
    })
 
    socket.on('startCountdownResults', data =>{ 
      this.question=data.q;
      this.questionNumber=data.questionNumber
      this.countdownResult();
    });
    socket.on('getStats', d => { //fixa den här, döp om, (typ loadStats)
      this.amountOfQuestions=d.amountOfQuestions
      this.moneyValues = d.levelValues
      this.moneyBoxes = d.levelColors
      this.participants= d.participants
    })

    socket.on('gameFinished', ()=>
      this.$router.push('/finalResult/'+this.pollId)
    )

    socket.emit( "getUILabels", this.lang );
    socket.emit( "joinPoll", this.pollId );
    socket.emit('getAmountQuestions', this.pollId);

  },
  mounted (){
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
        let elapsedTime = Date.now() - startTime;
        let timeLeftTest = timerDuration - elapsedTime;

        if (timeLeftTest > timerAnswer) {
          this.beforeQuestion = true
          this.timeLeftBeforeQuestion = Math.floor((3000 - elapsedTime)/1000);
        } else if (timeLeftTest > 0) {
          this.beforeQuestion = false
          this.questionActive = true;
          this.percentage = Math.floor(timeLeftTest / 100);
        } else {
          clearInterval(interval)
          //emit för att alla ska skicka upp sina svar
          socket.emit("testUserAnswers", {pollId:this.pollId,questionNumber:this.questionNumber}) //döp om
          setTimeout(()=>{
            socket.emit("getAllAnswers", this.pollId) //den ska både hämta svaren och skicka allas svar till sig själva
            this.questionActive=false, 
            this.percentage =100
          },2000)
        }
      }, 100);  
    },
  }
}
</script>

<style>
#pedestaler{
  width:100%;
  display: flex;
  justify-content: space-evenly;
  height:25%;
  background-color: #FF851B;
  margin-left:auto;
  margin-right:auto;
  bottom:0;
}
.pedestal{
  flex:1;
  max-width: 10%;
  height:60%;
  margin:auto;
}
#playersFrame{
  width:80%;
  display: flex;
  justify-content: space-evenly;
  height:100%;
  background-color: #4b6ab8;
  margin: auto;
}

#background{
  background-color: #001F3F;
  position: fixed;
  z-index: 1;
  display:flex;
  flex-direction:column;
}
#frame{
  height:55%; /*osäker på hur stor den ska va*/
  width: 80%;
  margin: auto;
  border-style:solid;
  border-color:#FF851B;
  border-width:5px;
  display:flex;
  top:20%
}
#moneyframe{
  background-color: #39A2DB;
  height: 100%;
  width: 20%;
  display: flex;
  justify-content: space-evenly;
  flex-direction: column-reverse;
}

</style>
