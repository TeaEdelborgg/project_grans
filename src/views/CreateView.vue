<template>
  <div>
    <p>Poll link: {{pollId}}</p>
    <!--<button v-on:click="createPoll">
      Create poll
    </button>-->
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
    
    <router-link v-bind:to="'/admin/' +pollId" v-on:click="startPoll">
      <button v-on:click="startPoll"> Start poll</button>
    </router-link>
    
    <!--<router-link v-bind:to="'/result/' + pollId">Check result</router-link>-->
    <!--<div v-if="pollData.questions && pollData.questions.length > 0">-->
    <div>
      <h3>Added Questions:</h3>
      <!--Fixa detta avsnitt, q är undefied i data när ni skickar det-->
      <div v-for="(q, index) in pollData.questions" :key="q.id">
        <div v-if="q.isEditing">
          <p>Editing Question: {{ q.id }}</p>
          <input type="text" v-model="q.q" placeholder="Edit question" />
          <input type="text" v-model="q.a.correct" placeholder="Edit correct answer" />
          <input 
            v-for="(answer,i) in q.a.wrong"
            :key="'editWrongAnswer' +q.id+i"
            v-model="q.a.wrong"
            placeholder="Edit wrong answer"
          />
          <button @click="saveEditedQuestion(q)">Save</button>
        </div>
        <div v-else>
          <p>Question {{ q.id }}:{{ q.q }}</p>
          <p>Correct Answer: {{ q.a.correct }}</p>
          <p>Wrong Answers: {{ q.a.wrong.join(', ') }}</p>
          <button @click="editQuestion(q)">Edit</button>
        </div>
      </div>
    </div>
    Data: {{ pollData }}
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
      maxQuestions: 15,
      numberOfQuestions:0,
      uiLabels: {},
      checkedAnswers: {},
      timeLeft:0,
      timeLeftBeforeQuestion:0
    }
  },
  created: function () {
    socket.on( "uiLabels", labels => this.uiLabels = labels );
    socket.on( "pollData", data => this.pollData = data );
    socket.on( "participantsUpdate", p => this.pollData.participants = p );
    socket.on("questionUpdate", updatedQuestion => this.updateQuestionInPollData(updatedQuestion));
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
    editQuestion(question){
      question.isEditing=true;
    },
    saveEditedQuestion(question){
      question.isEditing=false;
      socket.emit("updateQuestion",{pollId:this.pollId,q:question})
    },
    updateQuestionInPollData(updatedQuestion){
      const questionIndex = this.pollData.questions.findIndex(q =>q.id===updatedQuestion.id);
      if(questionIndex !==-1){
        this.pollData.questions[questionIndex] = updatedQuestion;
      }
    },
    startPoll: function () { 
      const numberOfQuestions = this.pollData.questions.length;
      socket.emit("startPoll", this.pollId, numberOfQuestions)
    },
    timerBeforeQUestion: function(){ //denna ska göra så att resultat också får count down
        let time={
          timeLeft:3,
          interval:null
        }
        time.interval = setInterval(()=>{
          if (time.timeLeft>0){
            time.timeLeft--;
            console.log("tiden innan fråga, ", time.timeLeft)
            socket.emit("getTimerBeforeQuestion",this.pollId)
          } else {
            socket.emit("startTime",{pollId:this.pollId, time:10})
            socket.emit("runQuestion", {pollId: this.pollId, questionNumber: this.questionNumber})
            this.timerQuestion();
            clearInterval(time.interval)
          }
        },1000);
    },
    timerQuestion: function (){ //resultat ska få denna också
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
            this.timeLeft=0
            clearInterval(time.interval)
            //här vill man göra så att alla personer skickar deras svar för att checkas, annars kan man titta under spelets gång 
          }
        },1000);
    },
    addQuestion: function () {
      /*this.answers = [this.correctAnswer, this.wrongAnswers]
      socket.emit("addQuestion", {pollId: this.pollId, q: this.question, a: this.answers} )
      console.log(this.correctAnswer)
      console.log(this.wrongAnswers) */
      const newQuestion = {
        //questionId: this.newQuestionId,
        q: this.question,
        a: {
          correct: this.correctAnswer,
          wrong: this.wrongAnswers,
        },
      };
      this.pollData.questions.push(newQuestion);
      this.answers = {correct: this.correctAnswer, wrong: this.wrongAnswers}
      //kolla över hur sockets fungerar och ändra sedan till newQuestion, var vaksam över hur variablerna skickas
      socket.emit("addQuestion", {pollId: this.pollId, newQuestion}); //q: this.question, a: this.answers});

      this.newQuestionId += 1;
      this.question = "";
      this.correctAnswer = "";
      this.wrongAnswers = ["", "", ""];
    },

    /* tar bort denna funktion som inte längre används
    addAnswer: function () {
      this.answers.push("");
    },*/

    runQuestion: function () {
      //socket.emit("startTime",{pollId:this.pollId, time:10})
      socket.emit("startTimeBeforeQuestion",{pollId:this.pollId, time:3})
      this.timerBeforeQUestion()
      //här måste timer köras för 
    }
  }
}
</script>


