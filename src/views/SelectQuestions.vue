<template>
  <div class="container">
    <div v-if="!continueToStart">

    <h1>{{ uiLabels.choosePollText }}</h1>
    <div class="pollButtons">
      <button v-on:click="choosePoll('quiz1')">
        History
        <img src="/public/img/history_icon.png" alt="icon1"/>
      </button>

      <button v-on:click="choosePoll('poll2')">
        Geography
        <img src="/public/img/geography_icon.png" alt="icon2"/>
      </button>

      <button v-on:click="choosePoll('poll2')">
        Science
        <img src="/public/img/science_icon.png" alt="icon3"/>
      </button>
    </div>    
    <button class="continue" v-on:click="continueToStart=true" :disabled="!chosenPoll">
      {{ uiLabels.choosePoll }}
    </button>
    <div v-for="(q, index) in pollData.questions" :key="index" class="questionBoxes">
        <p>{{ uiLabels.question + " " + (index + 1) + ": " + q.q }}</p>
        <p>{{ uiLabels.correctAnswer + ": " + q.a.correct }}</p>
        <p>{{ uiLabels.wrongAnswer + ": " + q.a.wrong }}</p>
    </div>
    </div>
    <div v-if="continueToStart" class="startPollButton">
    <h3> {{ uiLabels.readyMessage }}</h3>
    <h1>{{ uiLabels.pollId }} {{ pollId }}</h1>
    <router-link v-bind:to="'/admin/' +pollId" > 
    <button v-on:click="startPoll">
      {{uiLabels.startPoll}}</button>
    </router-link>
    </div>
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
        chosenPoll:false,
        
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
        this.chosenPoll=true;
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

<style scoped>
.container {
  display:grid; 
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh; 
  min-width: 100vw; 
  color:#cfcfcf;
  background: linear-gradient(135deg, #0a0347, #3c298f); 
  background-attachment: fixed; 
  background-size: cover;
  text-align: center;
  box-sizing: border-box; 
  overflow: hidden;

}

button{
  cursor: pointer;
  border: none;
  border-radius: 10px; 
  align-items: center;  
  text-align: center;
  font-size: 20px; 
  background-color: rgb(255, 136, 0);
  color: #1e084f; 
  box-shadow: 0 8px 5px rgba(0, 0, 0, 0.1); 
  transition: background-color 0.3s ease; 
}


button:hover {
  background-color: rgb(227, 122, 1);
  box-shadow: 0 8px 6px rgba(0, 0, 0, 0.4);
  transform: scale(1.2); 
}

h1{
  margin-top:5vh;
}

.pollButtons {
  display: flex;
  justify-content: space-around;
  margin:0vh 2vw;
}

.pollButtons button{
  display: flex;            
  flex-direction: column;
  justify-content: center;  
  width: auto;
  height:auto;
  padding: 2vh 3vw;
  margin: 5vh 5vw;
}

.pollButtons img{
  width: 70%;
  height: 70%; 
  margin-top:2vh;
}


.continue {
  width: auto;
  height:auto;
  padding: 3vh 2vw;
  margin: 5vh auto; /*5vw; */
}

.continue:disabled {
  background-color: rgb(227, 122, 1);;
  cursor: not-allowed;
  opacity: 0.5; 
  transform:scale(1);
}

.questionBoxes{
  display: block; 
  justify-content: center;
  margin: 3vh 40vw 3vh;
  font-size: 15px; 
  background-color: rgb(255, 136, 0, 0.4);
  color: #1e084f; 
  border-radius: 10px; 
  box-shadow: 0 8px 5px rgba(0, 0, 0, 0.1); 
  transition: background-color 0.3s ease; 
  padding: 1vh 1.5vw;
  text-align: center;
  box-sizing: border-box;
}

.startPollButton {
  display: block;
  justify-content:center;
  flex-direction:column;
  font-size: 20px;
  color: #cfcfcf;
  text-align: center;
}
.startPollButton button{
  margin: 5% ;
  padding: 3vh 2vw;
}

</style>