<template>
  <div class="container">
    <h1>{{ uiLabels.choosePollText }}</h1>
    <div class="quizButtons">
      <button v-on:click="choosePoll('quiz1')">
        {{ uiLabels.historyQuiz }}
        <img src="/public/img/history_icon.png" alt="icon1"/>
      </button>

      <button v-on:click="choosePoll('quiz2')">
        {{ uiLabels.geographyQuiz }}
        <img src="/public/img/geography_icon.png" alt="icon2"/>
      </button>

      <button v-on:click="choosePoll('quiz3')">
        {{ uiLabels.scienceQuiz }}
        <img src="/public/img/science_icon.png" alt="icon3"/>
      </button>
    </div>    
    <button 
      class="continue" 
      :disabled="!chosenPoll"
      v-on:click="continueToLobby">
        {{ uiLabels.choosePoll }}
    </button>

    <div v-for="(q, index) in quizData.questions" :key="index" class="questionBoxes">
        <p>{{ uiLabels.question + " " + (index + 1) + ": " + q.q }}</p>
        <p>{{ uiLabels.correctAnswer + q.a.correct }}</p>
        <p>{{ uiLabels.wrongAnswer + q.a.wrong.join(', ') }}</p>
    </div>
    </div>
  </template>
  
  <script>
  import io from 'socket.io-client';
  const socket = io(sessionStorage.getItem("dataServer"));

  export default {
    name: 'CreateView',
    data: function () {
      return {
        lang: localStorage.getItem("lang") || "en",
        quizId: "",
        question: "",
        answers: {},
        correctAnswer: "",
        wrongAnswers: ["", "", ""],
        questionNumber: 0,
        quizData: {},
        uiLabels: {},
        chosenPoll:false,
        
      }
    },
    created: function () {
      socket.on( "uiLabels", labels => this.uiLabels = labels );
      socket.on( "quizData", data => this.quizData = data );
      socket.on( "participantsUpdate", p => this.quizData.participants = p );
      socket.emit( "getUILabels", this.lang );
      socket.emit("getQuiz");
    },
    methods: {

      choosePoll: function(id) {
        if (this.lang==="sv"){
          this.quizId = (id + "Sv")
        }
        else {this.quizId = (id + "En")}
        this.chosenPoll=true;
        socket.emit("createPoll", { quizId: this.quizId, lang: this.lang });
        socket.emit("joinPoll", this.quizId);
        
      },
      continueToLobby() {
        if (this.chosenPoll) {
        this.$router.push(`/adminLobby/${this.quizId}`);
        }
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
  max-width: 100vw; 
  color:#cfcfcf;
  background: linear-gradient(135deg, #0a0347, #3c298f); 
  background-attachment: fixed; 
  background-size: cover;
  text-align: center;
  box-sizing: border-box; 
  overflow-x:hidden;
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
  margin: 10vh 10vw 5vh; 
  word-wrap: break-word; 
  white-space: normal;
  text-align: center; 
}

.quizButtons {
  display: flex;
  justify-content: space-around;
  margin:0vh 2vw;
}

.quizButtons button{
  display: flex;            
  flex-direction: column;
  justify-content: center;  
  width: auto;
  height:auto;
  padding: 2vh 3vw;
  margin: 0vh 5vw;
  color:#000;
  font-weight:bold;
}

.quizButtons img{
  width: 70%;
  height: 70%; 
  margin-top:2vh;
}


.continue {
  width: auto;
  height:auto;
  padding: 3vh 2vw;
  margin: 5vh auto;
  font-weight:bold;
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
  margin: 3vh auto;
  font-size: 15px; 
  width: 80%;
  max-width: 50vw;
  background-color: #1e084f;
  color: #cfcfcf; 
  border-radius: 10px; 
  box-shadow: 0 8px 5px rgba(0, 0, 0, 0.1); 
  transition: background-color 0.3s ease; 
  padding: 1vh 1.5vw;
  word-wrap: break-word; 
  white-space: normal;
  text-align: center; 
  box-sizing: border-box;
}


@media (max-width: 480px) {
button:hover {
  transform: scale(1.1); 
}
h1{
  margin: 15vh auto 3vh; 
}
.pollButtons {
  margin:0vh 1vw;
}

.pollButtons button{
  padding: 1vh 1vw;
  margin: 0vh 1vw;
  font-size: 10px;
}
.pollButtons img{
  width: 50%;
  height: 50%; 
  margin-top:2vh;
}
.continue {
  padding: 3vh 2vw;
  margin: 2vh auto;

}
}
</style>