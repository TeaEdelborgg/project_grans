<template>
  <div id="background">
    <div id="rowContainer">
      <Frame 
      v-on:countDownOver="countDownOver" 
      v-bind:amountOfQuestions="amountOfQuestions"  
      v-bind:correctAnswer="correctAnswer" 
      v-bind:questionNumber="questionNumber" 
      v-bind:question="question" 
      v-bind:uiLabels="uiLabels" 
      v-bind:questionActive="questionActive" 
      v-bind:moneyBoxes="moneyBoxes" 
      v-bind:moneyValues="moneyValues" 
      v-bind:participants="participants"></Frame>
      <HostPlayer v-bind:questionActive="questionActive"></HostPlayer>
    </div> 
    <br>
    <div id="pedestaler">
      <PlayerPedestal v-if="participants.length>0" v-for="player in participants" 
        v-bind:questionNumber="questionNumber" 
        v-bind:uiLabels="uiLabels" 
        v-bind:player="player" 
        v-bind:questionActive="questionActive"
        :key="player.id" />
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
      questionNumber:0,
      correctAnswer:''
    }
  },
  created: function () {
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
      this.question=data.q; //lägg ihop dessa till en
      this.questionNumber=data.questionNumber
      this.correctAnswer=data.correctAnswer
      this.questionActive=true
      console.log("question true: ", this.questionActive)
    });
    socket.on('loadStats', d => {
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
    socket.emit('getStats', this.pollId); 

  },
  mounted (){
    
  },
  methods:{
    countDownOver: function(){
      setTimeout(()=>{
          socket.emit("getAllAnswers", this.pollId) //den ska både hämta svaren och skicka allas svar till sig själva
          this.questionActive=false 
        },2000)
    }
  }
}
</script>

<style>
#box-test{
  height: 100%;
  width: 80%;
  clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
  background-color: black;
  justify-content: center;
  align-items: center;
  position: absolute;
}
#line-test{
  width: 100%;
  height: 5%;
  background-color: white;
}
#pedestaler{
  width:100%;
  display: flex;
  justify-content: space-evenly;
  height:25%;
  margin-left:auto;
  margin-right:auto;
  bottom:0;
  position: relative;
}
#rowContainer{
  display: flex;
  flex-direction: row;
  height: 75%;
  position: relative;
}
#background{
  background: radial-gradient(#1a237e, #0d1137);
  background-size:cover ;
  height: 100vh;
  width: 100vw;
  position: fixed;
  z-index: 1;
  display:flex;
  flex-direction:column;
}
</style>
