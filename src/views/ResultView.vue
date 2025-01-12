<template> <!--byt namn till GameView-->
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
      <PlayerPedestal v-if="participants.length>0 && pedestalLight?.length>0" v-for="(player,index) in participants" 
        v-bind:questionNumber="questionNumber" 
        v-bind:uiLabels="uiLabels" 
        v-bind:player="player" 
        v-bind:questionActive="questionActive"
        v-bind:lightPedestal="pedestalLight?.[index]"
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
  name: 'ResultView', //GameView
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
      participants: [],
      questionActive:false,
      amountOfQuestions:0,
      userId:'',
      moneyBoxes:[],
      moneyValues:[],
      questionNumber:0,
      correctAnswer:'',
      pedestalLight:[]
    }
  },
  created: function () {
    this.pollId = this.$route.params.id
    socket.on( "uiLabels", labels => this.uiLabels = labels );

    socket.on( "updatePedestalPlayer", p => { 
      this.pedestalLight = p;
    })

    socket.on("updateAfterQuestion", d=>{ 
      this.participants = d.participants 
      this.moneyBoxes = d.levelBoxes
    })
 
    socket.on('startCountdownResults', data =>{ 
      this.question=data.q; 
      this.questionNumber=data.questionNumber
      this.correctAnswer=data.correctAnswer
      this.questionActive=true
      this.pedestalLight=data.pedestalLight
    });
    socket.on('loadStats', d => {
      this.amountOfQuestions=d.amountOfQuestions
      this.moneyValues = d.levelValues
      this.moneyBoxes = d.levelColors
      this.participants= d.participants
      this.pedestalLight= d.pedestalLight
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
          socket.emit("getAllAnswers", this.pollId) 
          this.questionActive=false 
        },2000)
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
