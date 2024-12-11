<template>
  <div id="background">
    <div>
      lang: {{ lang }}
    </div>
    
    <!--<BarsComponent v-bind:labels="question.a" v-bind:data="submittedAnswers"/>-->
    <QuestionComponentResult v-if="questionActive" v-bind:question="question" v-bind:questionActive="questionActive" @timeUp="questionActive=false"></QuestionComponentResult> <!--Lägg till questionId senare-->
    <BeforeQuestionComponent v-if="beforeQuestion" v-bind:beforeQuestion="beforeQuestion" @timeUp="beforeQuestion=false"></BeforeQuestionComponent>
    <div id="players">
      <!-- Lägg in componenter för varje steg för priset -->
      <div id="contain">
        <Player v-if="participants.length>0" v-for="player in participants" v-bind:player="player" :key="player.id" id="player"/>
      </div>
    </div>
    
    <br>
    <div id="pedestaler">
          <PlayerPedestal v-show="participants.length>0" v-for="player in participants" v-bind:player="player" :key="player.id" id="pedestal"/>
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
      windowWidth:0
    }
  },
  created: function () {
    this.pollId = this.$route.params.id
    socket.on( "uiLabels", labels => this.uiLabels = labels );
    //socket.on("submittedAnswersUpdate", update => this.submittedAnswers = update);
    socket.on("questionUpdateResult", update => this.question = update );
    socket.on( "participantsUpdate", p => {
      
      this.participants = p;})
    //socket.on("startFirstTimer", this.TimerBeforeQuestion())
    //socket.on('getTime',time =>this.timeLeft=time);
    //socket.on('getTimeBeforeQuestion',timeTwo => this.timeLeftBeforeQuestion=timeTwo);
    socket.on('startTimerBeforeQuest', () =>{this.beforeQuestion=true;
      console.log("försöker starta timer")
    });
    socket.on('startTimer', () =>{
      this.beforeQuestion=false;
      this.questionActive=true;
      console.log("försöker starta timer")
    });
    //socket.on("checkedAnswer", answers => this.checkedAnswers = answers);

    //behöver mängden frågor

    socket.emit( "getUILabels", this.lang );
    socket.emit( "joinPoll", this.pollId );
    socket.emit("updateResult", this.pollId);
    

  },
  mounted (){
    this.windowHeight = document.documentElement.clientHeight
    this.windowWidth = document.documentElement.clientWidth;
    const backgroundResult = document.getElementById('background');
    backgroundResult.style.width=this.windowWidth +"px";
    backgroundResult.style.height=this.windowHeight + "px";
  },
  methods:{
    test: function(){
      console.log(this.pollData.participants)
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
#pedestal{
  flex:1;
 max-width: 10%;
  height:100px;
  margin:auto;
  background-color: lightpink;
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
#progressbar{
  width:100%;
  height:20px;
  background-color: lightgray;
  margin-left:auto;
  margin-right: auto;
}
#progress{
  width:100%;
  height:100%;
  background-color: yellow;
}

</style>
