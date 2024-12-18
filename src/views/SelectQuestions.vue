<template>
    <div v-if="!continueToStart">

    <button v-on:click="choosePoll('test')">
      Create Poll with Test ID
    </button>

    <!--Lägg till extra poll-->
    <button v-on:click="choosePoll('quiz1')">
      Create A History Poll
    </button>

    <!-- Lägg till extra poll -->
    <button v-on:click="choose('poll2')">
      Create A Geography Poll
    </button>

    <!--<button v-on:click="startPoll">
      Start poll
    </button>-->
     <!-- <router-link v-bind:to="'/admin/' +pollId" v-on:click="startPoll">Start poll</router-link> 

   <button v-on:click="runQuestion">
      Run question
    </button>
    <router-link v-bind:to="'/result/' + pollId">Check result</router-link>-->
    
    <button v-on:click="continueToStart=true">
      Välj poll
    </button>
    Data: {{ pollData }}
  </div>
  <div v-if="continueToStart">
    Ditt quiz är skapat! Låt alla deltagare gå med innan du klickar vidare.
    Quizkod: {{ pollId }}
    <router-link v-bind:to="'/admin/' +pollId" > <!--v-on:click="startPoll"-->
    <button v-on:click="startPoll"> Yes! Start poll</button>
    </router-link>
  </div>

  </template>
  
  <script>
  import io from 'socket.io-client';
  //const socket = io("localhost:3000");
  const socket = io(sessionStorage.getItem("dataServer")) //for mobile phones osv

  export default {
    name: 'CreateView',
    data: function () {
      return {
        lang: localStorage.getItem("lang") || "en",
        pollId: "",
        question: "",
        answers: {},
        correctAnswer: "",
        wrongAnswers: ["", "", ""],
        questionNumber: 0,
        pollData: {},
        uiLabels: {},
        continueToStart: false,
        
      }
    },
    created: function () {
      socket.on( "uiLabels", labels => this.uiLabels = labels );
      socket.on( "pollData", data => this.pollData = data );
      socket.on( "participantsUpdate", p => this.pollData.participants = p );
      socket.emit( "getUILabels", this.lang );
      socket.emit("getQuiz");
    },
    methods: {

      choosePoll: function(id) {
      this.pollId = id; 
      socket.emit("createPoll", { pollId: this.pollId, lang: this.lang });
      socket.emit("joinPoll", this.pollId);
      },

      startPoll: function () {
        socket.emit("startPoll", this.pollId)
      },
      addQuestion: function () {
        console.log(this.answers)
        console.log({pollId: this.pollId, q: this.question, a: this.answers})
      },
  
      runQuestion: function () {
        socket.emit("runQuestion", {pollId: this.pollId, questionNumber: this.questionNumber})
      }
    }
  }
  
  </script>
