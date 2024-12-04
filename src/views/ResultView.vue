<template>
  <div>
    lang: {{ lang }}
    {{ question.q }}
  </div>

  <BarsComponent v-bind:labels="question.a" v-bind:data="submittedAnswers"/>

  <span>{{ submittedAnswers }}</span>

  <span> Test spelare: {{ participants[0].information }} </span>
  <span> Allt från player component:</span>
  
  <Player v-for="player in participants" v-bind:player="player" :key="player.id"/>
</template>

<script>
// @ is an alias to /src
import BarsComponent from '@/components/BarsComponent.vue';
import Player from '@/components/Player.vue';
import io from 'socket.io-client';
const socket = io("localhost:3000");

export default {
  name: 'ResultView',
  components: {
    BarsComponent,
    Player
  },
  data: function () {
    return {
      lang: localStorage.getItem("lang") || "en",
      pollId: "",
      question: "",
      submittedAnswers: {},
      participants: []
    }
  },
  created: function () {
    this.pollId = this.$route.params.id
    socket.on( "uiLabels", labels => this.uiLabels = labels );
    socket.on("submittedAnswersUpdate", update => this.submittedAnswers = update);
    socket.on("questionUpdate", update => this.question = update );
    socket.on( "participantsUpdate", p => {
      console.log('hej från resultatview')
      this.participants = p;})
    socket.emit( "getUILabels", this.lang );
    socket.emit( "joinPoll", this.pollId );
  },
  methods:{
    test: function(){
      console.log(this.pollData.participants)
    }
  }
}
</script>
