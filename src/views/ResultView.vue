<template>
  <div id="background">
    <div>
      lang: {{ lang }}
    </div>
    
    <!--<BarsComponent v-bind:labels="question.a" v-bind:data="submittedAnswers"/>-->
    <QuestionComponentResult v-if="questionActive" v-bind:question="question" v-bind:questionActive="questionActive" @timeUp="questionActive=false"></QuestionComponentResult> <!--Lägg till questionId senare-->
    <div id="players">
      <!-- Lägg in componenter för varje steg för priset -->
      <div id="contain">
        <Player v-if="participants.length>0" v-for="player in participants" v-bind:player="player" :key="player.id" id="player"/>
      </div>
    </div>
    
    <br>
    Time Left:{{ timer.time }} <br>
    Time before Question:{{ timerBefore.time }} <br>
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
const socket = io("localhost:3000");

export default {
  name: 'ResultView',
  components: {
    BarsComponent,
    Player,
    PlayerPedestal,
    QuestionComponentResult
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
      timerBefore: {
        time:3,
        interval:null
      },
      timer:{
        time:10,
        interval:null
      },
      questionActive:false,
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
    socket.on('startTimerBeforeQuest', () =>{this.timerBeforeQUestion()
      console.log("försöker starta timer")
    });
    socket.on('startTimer', () =>{this.questionActive=true;

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
    timerBeforeQUestion: function(){ //vill ha pop up där timern syns med en text, när tiden är 0 försvinner den, ha component med detta, mörklägg bakgrunden
        console.log("i timer innan fråga")
        this.timerBefore.time=3;
        this.timerBefore.interval=null;
        this.timerBefore.interval = setInterval(()=>{
          if (this.timerBefore.time>0){
            this.timerBefore.time--;
          } else {
            clearInterval(this.timerBefore.interval)
          }
        },1000);
    }


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

</style>
