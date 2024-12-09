<template>
  <div>
    lang: {{ lang }}
    {{ question.q }}
  </div>
  
  <BarsComponent v-bind:labels="question.a" v-bind:data="submittedAnswers"/>
  <div id="progressbar">
    <div id="progress"></div>
  </div>
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
        <PlayerPedestal v-if="participants.length>0" v-for="player in participants" v-bind:player="player" :key="player.id" id="pedestal"/>
  </div>
</template>

<script>
// @ is an alias to /src
import BarsComponent from '@/components/BarsComponent.vue';
import Player from '@/components/Player.vue';
import PlayerPedestal from '@/components/PlayerPedestal.vue';
import io from 'socket.io-client';
const socket = io("localhost:3000");

export default {
  name: 'ResultView',
  components: {
    BarsComponent,
    Player,
    PlayerPedestal
  },
  data: function () {
    return {
      lang: localStorage.getItem("lang") || "en",
      pollId: "",
      question: {q: " ", answers: []}, //ändra så att question bara är tomt
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
      }
    }
  },
  created: function () {
    this.pollId = this.$route.params.id
    socket.on( "uiLabels", labels => this.uiLabels = labels );
    //socket.on("submittedAnswersUpdate", update => this.submittedAnswers = update);
    //socket.on("questionUpdate", update => this.question = update );
    socket.on( "participantsUpdate", p => {
      
      this.participants = p;})
    //socket.on("startFirstTimer", this.TimerBeforeQuestion())
    //socket.on('getTime',time =>this.timeLeft=time);
    //socket.on('getTimeBeforeQuestion',timeTwo => this.timeLeftBeforeQuestion=timeTwo);
    socket.on('startTimerBeforeQuest', () =>{this.timerBeforeQUestion()
      console.log("försöker starta timer")
    });
    socket.on('startTimer', () =>{this.timerQuestion()
      console.log("försöker starta timer")
    });
    //socket.on("checkedAnswer", answers => this.checkedAnswers = answers);

    //behöver mängden frågor

    socket.emit( "getUILabels", this.lang );
    socket.emit( "joinPoll", this.pollId );
    socket.emit("updateResult", this.pollId)

  },
  methods:{
    test: function(){
      console.log(this.pollData.participants)
    },
    timerBeforeQUestion: function(){ //denna ska göra så att resultat också får count down
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
    },
    timerQuestion: function (){ //resultat ska få denna också
        const progress = document.getElementById('progress');
        this.timer.time = 10;
        this.timer.interval = null;
        this.timer.interval = setInterval(()=>{
          if (this.timer.time>0){
            this.timer.time--;
            const percentage = (this.timer.time / 10) * 100
            progress.style.width=`${percentage}%`;
          } else{
            clearInterval(this.timer.interval)
          }
        },1000);
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
#progressbar{
  width:80%;
  height:20px;
  background-color: lightgray;
  margin-left:auto;
  margin-right: auto;
}
#progress{
  width:100%;
  height:100%;
  background-color: yellow;
  transition: width 0.5s linear;
}

</style>
