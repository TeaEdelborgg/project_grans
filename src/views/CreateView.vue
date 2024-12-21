<template>
  <div v-if = "!doneWithPoll">
    <p>Poll link: {{pollId}}</p>

    <div>
      {{ uiLabels.question +' '+newQuestionId }}:
      <input type="text" v-model="question" placeholder="Question"> 
      <div>
        Answers:
        <input v-model="correctAnswer" placeholder="Correct answer" />
        <input v-for="(_, i) in wrongAnswers" 
               v-model="wrongAnswers[i]" 
               v-bind:key="'wrongAnswer' + i"
               placeholder="Wrong answer"/>
      </div>
    </div>
    <button v-on:click="addQuestion" :disabled="pollData.questions.length >= maxQuestions">
      Add question
    </button>
    <button v-on:click="doneWithPoll=true">
      Done with poll!
    </button>

    <div>
      <h3>Added questions:</h3>
      <div v-for="(q, index) in pollData.questions" :key="index">
        <div v-if="q.isEditing">
          <p>Editing Question: {{ index + 1 }}</p>
          <input type="text" v-model="q.q" placeholder="Edit question" />
          <input type="text" v-model="q.a.correct" placeholder="Edit correct answer" />
          <input 
            v-for="(_, i) in q.a.wrong"
            :key="'editWrongAnswer' + index + i"
            v-model="q.a.wrong[i]"
            placeholder="Edit wrong answer"/>
          <button v-on:click="saveEditedQuestion(q, index)">Save</button>
        </div>
        <div v-else>
          <p>Question {{ index + 1 }}:{{ q.q }}</p>
          <p>Correct Answer: {{ q.a.correct }}</p>
          <p>Wrong Answers: {{ q.a.wrong }}</p>
          <button v-on:click="editQuestion(q)">Edit</button>
        </div>
      </div>
    </div>
    Data: {{ pollData }}
  </div>

  <div v-if="doneWithPoll">
    <div v-if="!continueToStart">
    Are you sure you are done?
    <button v-on:click="continueToStart = true">Yes, continue</button>
    <button v-on:click="doneWithPoll = false"> No, go back </button> 
    </div>
  </div>
  <div v-if="continueToStart">
    Ditt quiz är skapat! Låt alla deltagare gå med innan du klickar vidare.
    Quizkod: {{ pollId }}
    <router-link v-bind:to="'/admin/' +pollId">
    <button v-on:click="startPoll"> Yes! Start poll</button>
    </router-link>
    Deltagare:
    <div v-for="(participant, index) in pollData.participants" :key="index">
    {{ participant.information.name }}
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
      newQuestionId: 1,
      editingQuestion: null,
      pollData: {
        questions: []
      },
      maxQuestions: 15,
      uiLabels: {},
      checkedAnswers: {},
      timeLeft:0,
      timeLeftBeforeQuestion:0,
      doneWithPoll: false,
      continueToStart: false,
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
      return Math.random().toString(36).substring(2,10).toUpperCase();
      /*id ska tas bort om det genererats tidigare?*/
    },
    createPoll: function () {
      this.pollId=this.generatePollId();
      socket.emit("createPoll", {pollId: this.pollId, lang: this.lang })
      socket.emit("joinPoll", this.pollId);
    },

    editQuestion(q){
      q.isEditing=true;
    },

    saveEditedQuestion: function (q, index) {
      q.isEditing = false; 
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
      this.answers = {correct: this.correctAnswer, wrong: this.wrongAnswers}
      socket.emit("addQuestion", {pollId: this.pollId, q: newQuestion});

      this.newQuestionId += 1;
      this.question = "";
      this.correctAnswer = "";
      this.wrongAnswers = ["", "", ""];
    },

}
}
</script>