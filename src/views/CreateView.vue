<template>
  <div>
    <p>Poll link: {{pollId}}</p>
    <button v-on:click="createPoll">
      Create poll
      <!-- generate random poll id-->
    </button>
    <div>
      {{ uiLabels.question }}:
      <input type="text" v-model="question">
      <div>
        Answers:
        <input v-model="correctAnswer" placeholder="Correct answer" />
        <input v-for="(_, i) in wrongAnswers" 
               v-model="wrongAnswers[i]" 
               v-bind:key="'wrongAnswer' + i"
               placeholder="Wrong answer"/>
        <!-- Tar bort knappen för att skapa nya svar
        <button v-on:click="addAnswer">
          Add answer alternative
        </button> -->
      </div>
    </div>
    <button v-on:click="addQuestion">
      Add question
    </button>
    <input type="number" v-model="questionNumber">
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

    <div v-if="pollData.questions && pollData.questions.length > 0">
      <h3>Added Questions:</h3>
      <div v-for="(q, index) in pollData.questions" :key="index">
        <p>Question {{ index + 1 }}:{{ q.q }}</p>
        <p>Correct Answer: {{ q.a.correct }}</p>
        <p>Wrong Answers: {{ q.a.wrong.join(', ') }}</p>
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
    socket.emit( "getUILabels", this.lang );
    socket.on("checkedAnswer", answers => this.checkedAnswers = answers);
    socket.on('getTime',time =>this.timeLeft=time);


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
    startPoll: function () { 
      //this.timerQuestion()
      socket.emit("startPoll", this.pollId)
      this.timerQuestion();
    },
    timerBeforeQUestion: function(){
        let time={
          timeLeft:3,
          interval:null
        }
        time.interval = setInterval(()=>{
          if (time.timeLeft>0){
            time.timeLeft--;
            console.log("tiden innan fråga, ", time.timeLeft)
          } else {
            socket.emit("startTime",{pollId:this.pollId, time:10})
            socket.emit("runQuestion", {pollId: this.pollId, questionNumber: this.questionNumber})
            this.timerQuestion();
            clearInterval(time.interval)
          }
        },1000);
    },
    //ska finnas en annan timer som först är 5 sekunder och visar en viss rad inför nästa fråga, i resultat, sen ska timern köras.
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
        q: this.question,
        a: {
          correct: this.correctAnswer,
          wrong: this.wrongAnswers,
        },
      };
      
      this.answers = {correct: this.correctAnswer, wrong: this.wrongAnswers}
      socket.emit("addQuestion", {pollId: this.pollId, q: this.question, a: this.answers, newQuestion});
      this.pollData.questions.push(newQuestion);


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
    runQuestion: function () {
      //socket.emit("startTime",{pollId:this.pollId, time:10})
      this.timerBeforeQUestion()
    }
  }
}
</script>
