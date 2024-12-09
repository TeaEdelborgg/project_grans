<template>
  <div>
    lang: {{ lang }}
    {{ question.q }}
  </div>
  
  <BarsComponent v-bind:labels="question.a" v-bind:data="submittedAnswers"/>

  <div id="players">
    <!-- Lägg in componenter för varje steg för priset -->
    <div id="contain">
      <Player v-if="participants.length>0" v-for="player in participants" v-bind:player="player" :key="player.id" id="player"/>
    </div>
  </div>
  
  <br>
  Time Left:{{ timeLeft }} <br>
  Time before Question:{{ timeLeftBeforeQuestion }} <br>
  Checked Answers: {{ checkedAnswers }}
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
      checkedAnswers: {}
    }
  },
  created: function () {
    this.pollId = this.$route.params.id
    socket.on( "uiLabels", labels => this.uiLabels = labels );
    //socket.on("submittedAnswersUpdate", update => this.submittedAnswers = update);
    //socket.on("questionUpdate", update => this.question = update );
    socket.on( "participantsUpdate", p => {
      console.log('hej från resultatview')
      this.participants = p;})
    //socket.on("startFirstTimer", this.TimerBeforeQuestion())
    socket.on('getTime',time =>this.timeLeft=time);
    socket.on('getTimeBeforeQuestion',timeTwo => this.timeLeftBeforeQuestion=timeTwo);
    //socket.on("checkedAnswer", answers => this.checkedAnswers = answers);

    //behöver mängden frågor

    socket.emit( "getUILabels", this.lang );
    socket.emit( "joinPoll", this.pollId );

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

</style>
