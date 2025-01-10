<template>
  <div class="container">
    <div v-if = "!doneWithPoll">
      <header class="topSection">
        <div class="showId">{{ uiLabels.pollId }} {{pollId}}</div>
        <button v-on:click="doneWithPoll=true" class="continueButton">
          {{ uiLabels.doneWithQuiz }}
        </button>
      </header>
    <div>
      <h2>{{uiLabels.question + (pollData.questions.length+1)}}</h2>
      <AddQuestionComponent
          :uiLabels="uiLabels"
          :maxQuestions="maxQuestions"
          @add-question="addQuestion" 
        />

    </div>
    <div>
      <h3>{{ uiLabels.addedQuestions }}</h3>
      <EditQuestionComponent
        v-for="(q, index) in pollData.questions"
        :key="index"
        :question="q"
        :index="index"
        :uiLabels="uiLabels"
        @edit-question="editQuestion"
        @save-question="saveEditedQuestion"
      />
    </div>
  </div>

  <div v-if="doneWithPoll" >
    <div v-if="!continueToStart"  class="pollDone">
      {{ uiLabels.doneQuestion }}
      <div class="pollDoneButtons">
        <button id="goBack" v-on:click="doneWithPoll = false">{{ uiLabels.goBack }} </button>
          <router-link v-bind:to="'/adminLobby/' +pollId">
            <button> {{ uiLabels.continue }}</button>
          </router-link>
      </div>
    </div>
  </div>

  
</div>
</template>

<script>
import io from "socket.io-client";
import AddQuestionComponent from "../components/AddQuestionComponent.vue";
import EditQuestionComponent from "../components/EditQuestionComponent.vue";
const socket = io(sessionStorage.getItem("dataServer"));

export default {
  name: "CreateView",
  components: {
    AddQuestionComponent,
    EditQuestionComponent,
  },
  data() {
    return {
      lang: localStorage.getItem("lang") || "en",
      pollId: "",
      question: "",
      answers: {},
      correctAnswer: "",
      wrongAnswers: ["", "", ""],
      newQuestionId: 1,
      pollData: {
        questions: [],
      },
      maxQuestions: 9,
      uiLabels: {},
      checkedAnswers: {},
      timeLeft: 0,
      timeLeftBeforeQuestion: 0,
      doneWithPoll: false,
      continueToStart: false,
    };
  },
  created() {
    socket.on("uiLabels", (labels) => (this.uiLabels = labels));
    socket.on("pollData", (data) => (this.pollData = data));
    socket.on("participantsUpdate", (p) => (this.pollData.participants = p));
    socket.emit("getUILabels", this.lang);
    socket.on("checkedAnswer", (answers) => (this.checkedAnswers = answers));
    socket.on("getTime", (time) => (this.timeLeft = time));
    socket.on("getTimeBeforeQuestion", (timeTwo) => (this.timeLeftBeforeQuestion = timeTwo));
    this.createPoll();
  },
  methods: {
    generatePollId() {
      return Math.random().toString(36).substring(2, 8).toUpperCase();
    },
    createPoll() {
      this.pollId = this.generatePollId();
      socket.emit("createPoll", { pollId: this.pollId, lang: this.lang });
      socket.emit("joinPoll", this.pollId);
    },
    addQuestion(newQuestion) {
      newQuestion.id = this.newQuestionId;
      this.pollData.questions.push(newQuestion);
      socket.emit("addQuestion", { pollId: this.pollId, q: newQuestion });

      this.newQuestionId += 1;
    },

    editQuestion(index) {
      this.pollData.questions[index].isEditing = true;
    },
    saveEditedQuestion(updatedQuestion, index) {
      updatedQuestion.isEditing = false;
      this.pollData.questions[index] = updatedQuestion;
      socket.emit("updateQuestion", {
        pollId: this.pollId,
        questionToUpdate: updatedQuestion,
      });
    },
  },
};
</script>


<style scoped>
.container {
  display: grid;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  max-width: 100vw;
  color:#cfcfcf;
  background: linear-gradient(135deg, #0a0347, #3c298f);
  background-size: cover;
  text-align: center;
  box-sizing: border-box;
  overflow-x:hidden;
}

.topSection {
  display: flex; 
  flex-wrap: wrap; 
  justify-content: center; 
  align-items: center;
  position: relative;
  margin-top: 20vh;
  margin-bottom: 0vh;
  gap: 1vh; 
}

.showId {
  font-size: 20px;
  font-weight: bold;
  color:#000;
  background-color: #cfcfcf;
  border-radius: 10px;
  padding: 10px 20px;
  align-items: middle;
  align-self:left;
  margin-right:10vw;
}

.continueButton {
  margin-left:10vw;
  align-self: right;
  border: none;
  cursor: pointer;
  font-size: 20px;
  font-weight:bold;
  background-color: rgb(255, 136, 0);
  color: #1e084f;
  border-radius: 10px;
  padding: 10px 20px;
  box-shadow: 0 8px 5px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease, transform 0.3s ease;

}


.continueButton:hover{
  background-color: rgb(227, 122, 1);
  box-shadow: 0 8px 6px rgba(0, 0, 0, 0.4);
  transform: scale(1.2);
}

h1{margin:1vh}
h3{
  margin-top:2vh;
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
  font-weight:bold;
  background-color: rgb(255, 136, 0);
  color: #1e084f;
  border-radius: 10px;
  padding: 10px 20px;
  box-shadow: 0 8px 5px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease, transform 0.3s ease;
  text-align: center;
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
  font-weight:bold;
  color: #fff;
  text-align: center;
}
.startPollButton button{
  border: none;
  cursor: pointer; 
  margin: 5% ;
  font-size: 20px;
  background-color: rgb(255, 136, 0);
  color: #1e084f;
  border-radius: 10px;
  padding: 10px 20px;
  box-shadow: 0 8px 5px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease, transform 0.3s ease;
  text-align: center;
}
.startPollButton button:hover{
  background-color: rgb(227, 122, 1);
  box-shadow: 0 8px 6px rgba(0, 0, 0, 0.4);
  transform: scale(1.2);
}

</style>