<template>

    <button v-on:click="choosePoll('test')">
      Create Poll with Test ID
    </button>

    <!--Lägg till extra poll-->
    <button v-on:click="choosePoll('poll1')">
      Create Poll with Poll 1 ID
    </button>

    <!-- Lägg till extra poll -->
    <button v-on:click="choose('poll2')">
      Create Poll with Poll 2 ID
    </button>

    <!--<button v-on:click="startPoll">
      Start poll
    </button>-->
    <router-link v-bind:to="'/admin/' +pollId" v-on:click="startPoll">Start poll</router-link> 

    <button v-on:click="runQuestion">
      Run question
    </button>
    <router-link v-bind:to="'/result/' + pollId">Check result</router-link>
    
    Data: {{ pollData }}

  </template>
  
  <script>
  import io from 'socket.io-client';
  const socket = io("localhost:3000");
  
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
      }
    },
    created: function () {
      socket.on( "uiLabels", labels => this.uiLabels = labels );
      socket.on( "pollData", data => this.pollData = data );
      socket.on( "participantsUpdate", p => this.pollData.participants = p );
      socket.emit( "getUILabels", this.lang );
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
