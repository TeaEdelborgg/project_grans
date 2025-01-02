<template>
  <div id="background">
    <!--<div> Fixa lang saken, syns inte atm
      lang: {{ lang }}
    </div>-->
    <!--<h1 :style="{color:'white'}">{{ uiLabels.heading}}</h1>-->
    <div id="rowContainer">
      <Frame v-bind:amountOfQuestions="amountOfQuestions" v-on:countDownOver="countDownOver" v-bind:question="question" v-bind:uiLabels="uiLabels" v-bind:questionActive="questionActive" v-bind:moneyBoxes="moneyBoxes" v-bind:moneyValues="moneyValues" v-bind:participants="participants"></Frame>
      <HostPlayer v-bind:questionActive="questionActive"></HostPlayer>
    </div> 
    <br>
    <div id="pedestaler">
      <PlayerPedestal v-if="participants.length>0" v-for="player in participants" v-bind:questionNumber="questionNumber" v-bind:uiLabels="uiLabels" v-bind:player="player" v-bind:questionActive="questionActive":key="player.id" class="pedestal"/>
    </div>
  </div>
</template>

<script>

// @ is an alias to /src
import BarsComponent from '@/components/BarsComponent.vue';
import PlayerPedestal from '@/components/PlayerPedestal.vue';
import io from 'socket.io-client';
import HostPlayer from '@/components/hostPlayer.vue';
import Frame from '@/components/Frame.vue';
//const socket = io("localhost:3000");
const socket = io(sessionStorage.getItem("dataServer")) //for mobile phones osv

export default {
  name: 'ResultView',
  components: {
    BarsComponent,
    PlayerPedestal,
    HostPlayer,
    Frame
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


    socket.on( "updatePedestalPlayer", p => { //den här uppdateras när man har svarat, sedan tittas i pedestalerna om antal svar= currentQuestion
      this.participants = p;
    })
    //^byt ut till updatePedestalPlayer, borde kanske endast behöva vara true eller false och inte hela participants

    socket.on("sendAllAnswers", d=>{ //updateAfterQuestion
      this.participants = d.participants //behövs inte om alla svar tittas på direkt när man svarat och skickas tillbaka, eller skickar 
      //participant update när svaren har rättats
      this.moneyBoxes = d.levelBoxes
    })
 
    socket.on('startCountdownResults', data =>{ 
      this.question=data.q; //vill också hämta answers
      this.questionNumber=data.questionNumber
      this.questionActive=true
      console.log("question true: ", this.questionActive)
    });
    socket.on('loadStats', d => { //fixa den här, döp om, (typ loadStats)
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
    socket.emit('getStats', this.pollId); //loadar stats

  },
  mounted (){
    this.windowHeight = document.documentElement.clientHeight
    this.windowWidth = document.documentElement.clientWidth;
    const backgroundResult = document.getElementById('background');
    backgroundResult.style.width=this.windowWidth +"px";
    backgroundResult.style.height=this.windowHeight + "px";
  },
  methods:{
    countDownOver: function(){ // finnas i admin?
    setTimeout(()=>{
          socket.emit("getAllAnswers", this.pollId) //den ska både hämta svaren och skicka allas svar till sig själva
          this.questionActive=false 
        },2000)
      /*socket.emit("testUserAnswers", {pollId:this.pollId,questionNumber:this.questionNumber}) //döp om
          setTimeout(()=>{
            socket.emit("getAllAnswers", this.pollId) //den ska både hämta svaren och skicka allas svar till sig själva
            this.questionActive=false 
          },2000)*/
    }
  }
}
</script>

<style>
#pedestaler{
  width:100%;
  display: flex;
  justify-content: space-evenly;
  height:25%;
  /*background-color: #FF851B;*/
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
#rowContainer{
  display: flex;
  flex-direction: row;
  height: 75%;
  position: relative;
}
#background{
 /* background-color: #001F3F;*/
  background-image: url(/img/background_whowantstobeamillionare.webp);
  background-size:cover ;
  position: fixed;
  z-index: 1;
  display:flex;
  flex-direction:column;
}


</style>
