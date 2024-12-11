<template>
  <div>
    <p>Poll link: {{pollId}}</p>
    <div>
      {{ uiLabels.question + ' ' + newQuestionId}}:
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
    <button v-on:click="addQuestion">
      Add question
    </button>
    <!--<input type="number" v-model="questionNumber">-->

    <!--När man startat kommer man till en egen admin vue-->
    <button v-on:click="startPoll">
      Start poll
    </button>
    <button v-on:click="runQuestion"> 
     Run question
    </button>
    <button v-on:click="checkAnswers">
      Check answers
    </button>
    <router-link v-bind:to="'/result/' + pollId">Check result</router-link>

  <div>
    <h3>Added Questions:</h3>
    <div v-for="(q, index) in pollData.questions" :key="q.id">
      <!-- redigera frågor -->
      <div v-if="q.isEditing">
        <p>Editing Question {{ q.id }}</p>
        <input type="text" v-model="q.q" placeholder="Edit question" />
        <input v-model="q.a.correct" placeholder="Edit correct answer" />
        <input
          v-for="(answer, i) in q.a.wrong"
          :key="'editWrongAnswer' + q.id + i"
          v-model="q.a.wrong[i]"
          placeholder="Edit wrong answer"
        />
        <button @click="saveEditedQuestion(q)">Save</button>

      </div>

      <!-- View Mode -->
      <div v-else>
        <p>Question {{ q.id }}: {{ q.q }}</p>
        <p>Correct Answer: {{ q.a.correct }}</p>
        <p>Wrong Answers: {{ q.a.wrong.join(', ') }}</p>
        <button @click="editQuestion(q)">Edit</button>
      </div>
    </div>
    </div>
    Data: {{ pollData }}
    CheckedAnswers: {{ checkedAnswers }}
    Time Left:{{ timeLeft }}
  </div>
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
      newQuestionId: 1,
      editingQuestion: null,
      pollData: {
        questions: []
      },
      uiLabels: {},
      checkedAnswers: {},
      timeLeft:0,
    }
  },
  created: function () {
    socket.on( "uiLabels", labels => this.uiLabels = labels );
    socket.on( "pollData", data => this.pollData = data );
    socket.on( "participantsUpdate", p => this.pollData.participants = p );
    socket.on("questionUpdate", updatedQuestion => this.updateQuestionInPollData(updatedQuestion));
    socket.emit( "getUILabels", this.lang );
<<<<<<< HEAD
    socket.on("checkedAnswer", answers => this.checkedAnswers = answers);
    socket.on('getTime',time =>this.timeLeft=time);


=======
    this.createPoll();
>>>>>>> 664cc43a17cfd1c5a00ca2a68fd6ae6baad65eec
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

    editQuestion(question) {
      question.isEditing = true;
    },
    saveEditedQuestion(question) {
      question.isEditing = false; // Save changes and exit edit mode
      // Optional: Emit a socket event or update data on the server
      console.log("Question saved:", question);
      socket.emit("updateQuestion", { pollId: this.pollId, question });
    },
    updateQuestionInPollData(updatedQuestion) {
      const questionIndex = this.pollData.questions.findIndex(q => q.id === updatedQuestion.id);
      if (questionIndex !== -1) {
        this.pollData.questions[questionIndex] = updatedQuestion;
      }
    },
    
    addQuestion() {
      const newQuestion = {
        id: this.newQuestionId,
        q: this.question,
        a: {
          correct: this.correctAnswer,
          wrong: this.wrongAnswers,
        },
      };

      this.pollData.questions.push(newQuestion);
      socket.emit("addQuestion", { pollId: this.pollId, newQuestion });

      this.newQuestionId += 1;
      this.question = "";
      this.correctAnswer = "";
      this.wrongAnswers = ["", "", ""];
    },
  
    startPoll: function () {
      socket.emit("startPoll", this.pollId)
      socket.emit("startTime",{pollId:this.pollId, time:10})
      this.timerQuestion()
    },
    timerQuestion: function (){
        let time ={
          timeLeft:10,
          interval:null
        }
        time.interval = setInterval(()=>{
          if (time.timeLeft>0){
            time.timeLeft--;
            console.log("tiden i create ",time.timeLeft)
            socket.emit("getTimer",this.pollId)
          } else{
            console.log("tiden uppe i timerQuestion")
            socket.emit("timesUp",this.pollId)
            time.timeLeft=0
            clearInterval(time.interval)
            //här vill man göra så att alla personer skickar deras svar för att checkas, annars kan man titta under spelets gång 
          }
        },1000);
    },
<<<<<<< HEAD
    addQuestion: function () {
      /*this.answers = [this.correctAnswer, this.wrongAnswers]
      socket.emit("addQuestion", {pollId: this.pollId, q: this.question, a: this.answers} )
      console.log(this.correctAnswer)
      console.log(this.wrongAnswers) */
      
      this.answers = {correct: this.correctAnswer, wrong: this.wrongAnswers}
      socket.emit("addQuestion", {pollId: this.pollId, q: this.question, a: this.answers} )
      console.log(this.answers)
      console.log({pollId: this.pollId, q: this.question, a: this.answers})
    },
    checkAnswers: function(){
      socket.emit("checkAnswer", {pollId:this.pollId, questionNumber:this.questionNumber})
    },

    /* tar bort denna funktion som inte längre används
    addAnswer: function () {
      this.answers.push("");
    },*/
=======
    
>>>>>>> 664cc43a17cfd1c5a00ca2a68fd6ae6baad65eec
    runQuestion: function () {
      socket.emit("runQuestion", {pollId: this.pollId, questionNumber: this.questionNumber})
      socket.emit("startTime",{pollId:this.pollId, time:10})
      this.timerQuestion()
    }
  }
}
</script>


