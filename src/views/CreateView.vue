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
    <router-link v-bind:to="'/admin/' +pollId" v-on:click="startPoll">Start poll</router-link>
    <div v-if="pollData.questions && pollData.questions.length > 0">
      <h3>Added Questions:</h3>
      <div v-for="(q, index) in pollData.questions" :key="index">
        <p>Question {{ index + 1 }}:{{ q.q }}</p>
        <p>Correct Answer: {{ q.a.correct }}</p>
        <p>Wrong Answers: {{ q.a.wrong.join(', ') }}</p>
    </div>
    </div>
    </div>
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
      newQuestionId: 1,
      editingQuestion: null,
      pollData: {
        questions: []
      },
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
    startPoll: function () { 
      socket.emit("startPoll", this.pollId)
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
        q: this.question,
        a: {
          correct: this.correctAnswer,
          wrong: this.wrongAnswers,
        },
      };
      
      this.answers = {correct: this.correctAnswer, wrong: this.wrongAnswers}
      socket.emit("addQuestion", {pollId: this.pollId, q: this.question, a: this.answers, newQuestion});
      this.pollData.questions.push(newQuestion);

      this.newQuestionId += 1;
      this.question = "";
      this.correctAnswer = "";
      this.wrongAnswers = ["", "", ""];

      console.log(this.answers)
      console.log({pollId: this.pollId, q: this.question, a: this.answers})
    },
    checkAnswers: function(){ //resultat behöver också den
      socket.emit("checkAnswer", {pollId:this.pollId, questionNumber:this.questionNumber})
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


