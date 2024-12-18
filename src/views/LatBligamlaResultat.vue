<template>
    <div id="background">
      <div> <!--Fixa lang saken, syns inte atm-->
        lang: {{ lang }}
      </div>
      <h1 :style="{color:'white'}">{{ uiLabels.heading}}</h1>
      <!--<BarsComponent v-bind:labels="question.a" v-bind:data="submittedAnswers"/>-->
      <QuestionComponentResult v-if="questionActive" v-bind:progress="percentage" v-bind:question="question"  ></QuestionComponentResult> <!--Lägg till questionId senare-->
      <BeforeQuestionComponent v-if="beforeQuestion" v-bind:uiLabels="uiLabels" v-bind:timeLeft="timeLeftBeforeQuestion" ></BeforeQuestionComponent>
        <div id="frame">
          <div id="moneyframe">
              <div id="switchout">
                  <div id="containerBoxTest">
                    <Moneybox v-for="index in amountOfQuestions" v-bind:boxState="moneyBoxes[index-1]" v-bind:value="moneyValues[index-1]" :id="index"/>
                  </div>
              </div>
          </div>
          <div id="players">
            <div class="contain">
              <Player v-if="participants.length>0"  v-for="player in participants" v-bind:player="player" v-bind:amountOfQuestions="amountOfQuestions":key="player.id" id="player"/>
            </div>
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
        console.log("mottaget questionNumber: ", data.questionNumber)
        //ha current Question?
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
          } else {
            clearInterval(interval)
            setTimeout(()=>{
              socket.emit("getAllAnswers", this.pollId)
              //socket.emit("getAllAnswersTest", this.pollId)
              this.questionActive=false, //här vill man även ändra färgen på alla pedestaler tillbaka till grå
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
  #players{
    width:80%;
    display: flex;
    justify-content: space-evenly;
    height:100%;
    background-color: #4b6ab8;
    margin: auto;
  }
  #player{
    flex:1;
    max-width: 95%;
  }
  .contain{
    width: 100%;
    height:90%;
    display: flex;
    margin:auto;
  }
  #background{
    background-color: #001F3F;
    position: fixed;
    z-index: 1;
    display:flex;
    flex-direction:column;
  }
  #questionFrame{ 
      height: 75%;
      width: 100%;
      margin:auto;
      background-color: #001F3F;
      z-index: 3;
      position: absolute;
  
  }
  #backgroundFrame{
      height: 75%;
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
  #frame{
    height:55%; /*osäker på hur stor den ska va*/
    width: 80%;
    margin: auto;
    border-style:solid;
    border-color:#FF851B;
    border-width:5px;
  }
  #moneyframe{
    float: left;
    background-color: #39A2DB;
    height: 100%;
    width: 20%;
    margin:auto;
    flex-grow: 1;
    justify-content: space-evenly; /* occupy the space evenly */
    align-content: center;
    overflow: hidden; /* prevent overflowing from container*/
  }
  
  #switchout{
    width:70%;
    height:90%;
    margin:auto;
    display: flex;
    justify-content: space-evenly;
  }
  
  #containerBoxTest{
    width: 100%;
    display: flex;
    flex-direction: column-reverse;
    justify-content: space-evenly;
    height: 100%;
    margin:auto
  }
  
  </style>
  