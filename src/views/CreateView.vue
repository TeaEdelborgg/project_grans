<template>
  <div class="container">
    <div v-if = "!doneWithPoll">
      <header class="topSection">
        <p class="showId">{{ uiLabels.pollId }} {{pollId}}</p>
        <button v-on:click="doneWithPoll=true" class="continueButton">
          {{ uiLabels.doneWithQuiz }}
        </button>
      </header>
    <div>
      <h2>{{uiLabels.question + (pollData.questions.length+1)}}</h2>
      <input type="text" v-model="question" placeholder="Question "  class="questionBox"> 
      <div class="answerBoxes">
        <input v-model="correctAnswer" placeholder="Correct answer" />
        <input v-for="(_, i) in wrongAnswers" 
               v-model="wrongAnswers[i]" 
               v-bind:key="'wrongAnswer' + i"
               placeholder="Wrong answer"/>
      </div>
    </div>
    <button v-on:click="addQuestion" :disabled="pollData.questions.length >= maxQuestions" class="addButton">
      {{ uiLabels.addQuestion }}
    </button>

    

    <div>
      <h3>{{ uiLabels.addedQuestions }}</h3>
      <!--Fixa detta avsnitt, q är undefied i data när ni skickar det-->
      <div v-for="(q, index) in pollData.questions" :key="index">
        <div v-if="q.isEditing" class="questionBoxes">
          <p>{{ uiLabels.editingQuestion + ' ' + (index + 1) }}</p>
          <input type="text" v-model="q.q" placeholder="Edit question" />
          edit correct answer
          <input type="text" v-model="q.a.correct" placeholder="Edit correct answer"/>
          edit wrong answer
          <input 
            v-for="(_,i) in q.a.wrong"
            :key="'editWrongAnswer' + index + i"
            v-model="q.a.wrong[i]"
            placeholder="Edit wrong answer"
          />
          <button v-on:click="saveEditedQuestion(q, index)">{{ uiLabels.saveQuestion }}</button>
        </div>
        <div v-else class="questionBoxes">
          <p>{{ uiLabels.question + " " + (index + 1) + ": " + q.q }}</p>
          <p>{{ uiLabels.correctAnswer + ": " + q.a.correct }}</p>
          <p>{{ uiLabels.wrongAnswer + ": " + q.a.wrong }}</p>
          <button v-on:click="editQuestion(q)">{{ uiLabels.editQuestion }}</button>
        </div>
      </div>
    </div>

  </div>
  <div v-if="doneWithPoll" >
    <div v-if="!continueToStart"  class="pollDone">
      {{ uiLabels.doneQuestion }}
      <div class="pollDoneButtons">
        <button id="goBack" v-on:click="doneWithPoll = false">{{ uiLabels.goBack }} </button>
        <button v-on:click="continueToStart = true">{{ uiLabels.continue }} </button>
      </div>
    </div>
  </div>
  <div v-if="continueToStart" class="startPollButton">
    <h2>{{ uiLabels.pollId }} {{ pollId }}</h2>
    <router-link v-bind:to="'/admin/' +pollId">
    <button v-on:click="startPoll">{{uiLabels.startPoll}}</button>
    </router-link>
    <p>{{ uiLabels.participants }}</p>
    <div v-for="(participant, index) in pollData.participants" :key="index">
      {{ participant.information.name }}
    </div>
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
      //questionNumber: 0,
      newQuestionId: 1,
      editingQuestion: null,
      pollData: {
        questions: []
      },
      maxQuestions: 9,
      //numberOfQuestions:0,
      uiLabels: {},
      checkedAnswers: {},
      timeLeft:0,
      timeLeftBeforeQuestion:0,
      doneWithPoll: false,
      continueToStart: false
    }
  },
  created: function () {
    socket.on( "uiLabels", labels => this.uiLabels = labels );
    socket.on( "pollData", data => this.pollData = data );
    socket.on( "participantsUpdate", p => this.pollData.participants = p );
    socket.emit( "getUILabels", this.lang );
    socket.on("checkedAnswer", answers => this.checkedAnswers = answers);
    socket.on('getTime',time =>this.timeLeft=time);
    socket.on('getTimeBeforeQuestion',timeTwo => this.timeLeftBeforeQuestion=timeTwo);
    this.createPoll();

  },
  methods: {

    generatePollId: function(){
      /*return Math.random().toString(36).substring(2,10).toUpperCase();*/
      return Math.floor(100000 + Math.random() * 900000);
      /*id ska tas bort om det genererats tidigare?*/
    },
    createPoll: function () {
      this.pollId=this.generatePollId();
      socket.emit("createPoll", {pollId: this.pollId, lang: this.lang })
      socket.emit("joinPoll", this.pollId);
    },
    addQuestion: function () {
      const newQuestion = {
        id: this.newQuestionId,
        q: this.question,
        a: {
          correct: this.correctAnswer,
          wrong: this.wrongAnswers,
        },
      };
      this.pollData.questions.push(newQuestion);
      /*kolla över hur den här skickas igen*/ 
      this.answers = {correct: this.correctAnswer, wrong: this.wrongAnswers}
      socket.emit("addQuestion", {pollId: this.pollId, q: newQuestion});

      this.newQuestionId += 1;
      this.question = "";
      this.correctAnswer = "";
      this.wrongAnswers = ["", "", ""];
    },
    editQuestion(q){
      q.isEditing=true;
    },
    saveEditedQuestion(q, index){
      q.isEditing=false;
      const editedQuestion = {
        id: index + 1, 
        q: q.q, 
        a: {
          correct: q.a.correct,
          wrong: q.a.wrong,
        },
      };
      this.pollData.questions[index] = editedQuestion;
      socket.emit("updateQuestion", { pollId: this.pollId, questionToUpdate: editedQuestion });
    },
    startPoll: function () { 
      socket.emit("startPoll", this.pollId)
    },
  }
}
</script>

<style scoped>
.container {
  display: grid;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: 100vw;
  color:#cfcfcf;
  background: linear-gradient(135deg, #0a0347, #3c298f);
  /*background-attachment: fixed;*/
  background-size: cover;
  text-align: center;
  box-sizing: border-box;
}

::placeholder{
  color:#1e084f;
  opacity:80%;
}

.topSection {
  display: flex;
  /*justify-content: center; /* Center elements horizontally */
  align-items: center; /* Center elements vertically */
  position: relative; /* Allow for absolute positioning of continueButton */
  margin-top:55px;
}

.showId {
  justify-content:center;
  font-size: 20px;
  font-weight: bold;
  color:#000;
  background-color: #cfcfcf;
  border-radius: 10px;
  padding: 10px 20px;
  position: absolute; /* Absolute positioning */
   /* Move to the middle of the parent */
  align-items: middle;
}

.continueButton {
  position: absolute;
  right: 0vw;
  border: none;
  cursor: pointer;
  font-size: 20px;
  background-color: rgb(255, 136, 0);
  color: #fff;
  border-radius: 10px;
  padding: 10px 20px;
  box-shadow: 0 8px 5px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease;
}

.addButton {
  border: none;
  cursor: pointer;
  font-size: 20px;
  background-color: rgb(255, 136, 0);
  color: #fff;
  border-radius: 10px;
  padding: 10px 20px;
  box-shadow: 0 8px 5px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease;
}

.continueButton:hover,
.addButton:hover {
  background-color: rgb(227, 122, 1);
  box-shadow: 0 8px 6px rgba(0, 0, 0, 0.4);
  transform: scale(1.2);
}

h2{
  margin-top:10vh;
}
.questionBox{
  cursor: pointer;
   
  font-size: 20px;   
  color: rgb(255, 136, 0);
  background-color: #cfcfcf;
  border-radius: 10px; 
  border: none;
  cursor: pointer;
  box-shadow: 0 8px 5px rgba(0, 0, 0, 0.1); 
  transition: background-color 0.3s ease; 
  width: 48vw;
  height:10vh;
  text-align: center;
}
.answerBoxes {
  display: grid; 
  grid-template-columns: repeat(2, 1fr); 
  gap: 20px; 
  margin: 20px auto; 
  width: 50vw; 
  padding: 10px; 
  border: none;
  font-size: 15px;

  border-radius: 10px;

  text-align: center;
  box-sizing: border-box;
}

.answerBoxes input {
  width: 100%; 
  padding: 30px;
  font-size: 20px;
  border: none;
  background-color: #cfcfcf;
  color: rgb(255, 136, 0);
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
  box-sizing: border-box;
}

.questionBoxes{
  display: block;
  flex-direction:column;
  align-items: center; 
  gap: 20px; 
  margin: 20px auto; 
  width: 20vw; 
  padding: 10px;
  cursor: pointer;
  font-size: 15px;
  background-color: rgb(255, 136, 0, 0.5);
  color: #fff;
  border-radius: 10px;
  text-align: center;
  box-sizing: border-box;
}
.questionBoxes input,
.questionBoxes button{
  width: 100%;
  font-size: 15px;
  padding: 10px;
  margin-top: 5px;
  margin-bottom: 5px;
  border: none;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
  box-sizing: border-box;
}


.pollDone{
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size:30px;
  text-align:center;
  color:#fff
}

.pollDoneButtons button {
  flex-direction:row;
  border: none;
  cursor: pointer;
  margin-left: 5vw;
  margin-right: 5vw;
  margin-top: 10vh;
  font-size: 20px;
  background-color: rgb(255, 136, 0);
  color: #fff;
  border-radius: 10px;
  padding: 10px 20px;
  box-shadow: 0 8px 5px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease;
  text-align: center;
}
.pollDoneButtons #goBack{
  background-color: #cfcfcf;
  color: #000;
}

.pollDone button:hover {
  background-color: rgb(227, 122, 1);
  box-shadow: 0 8px 6px rgba(0, 0, 0, 0.4);
  transform: scale(1.2);
}

.startPollButton {
  display: block;
  justify-content:center;
  flex-direction:column;
  font-size: 20px;
  color: #fff;
  text-align: center;
}
.startPollButton button{
  border: none;
  cursor: pointer; 
  margin: 20% ;
  font-size: 20px;
  background-color: rgb(255, 136, 0);
  color: #fff;
  border-radius: 10px;
  padding: 10px 20px;
  box-shadow: 0 8px 5px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease;
  text-align: center;
}
.startPollButton button:hover{
  background-color: rgb(227, 122, 1);
  box-shadow: 0 8px 6px rgba(0, 0, 0, 0.4);
  transform: scale(1.2);
}


</style>