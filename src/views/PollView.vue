<template>
  <div>
    {{pollId}}
    <QuestionComponent ref="questionComponent" v-bind:question="question"
              v-on:answer="submitAnswer($event)"/>
    <hr>
    <span>{{submittedAnswers}}</span>
    Checked answer {{ checkedAnswer }}
  </div>
</template>

<script>
// @ is an alias to /src
import QuestionComponent from '@/components/QuestionComponent.vue';
import io from 'socket.io-client';
const socket = io("localhost:3000");

export default {
  name: 'PollView',
  components: {
    QuestionComponent
  },
  data: function () {
    return {
      question: {
        q: "",
        a: []
      },
      pollId: "inactive poll",
      submittedAnswers: {},
      questionRandom:{
        q:"",
        a:[]
      },
      questionNumber: null,
      checkedAnswer: false,
    }
  },
  created: function () {
    this.pollId = this.$route.params.id;
    this.userId = this.$route.params.userId;
    /*socket.on( "questionUpdate", q => { 
      console.log("tog emot fråga, ", q)
      this.question = q; 
      this.$refs.questionComponent.updateSent();              
     }); */
    socket.on("randomOrderUpdate", q =>{
      console.log("tog emot ranodm fråga, ",q.q);
      this.question=q.q;
      this.questionNumber=q.questionNumber;
      console.log("tog emot random fråga, ",q.questionNumber)
      this.$refs.questionComponent.updateSent(); 
    })
    socket.on( "submittedAnswersUpdate", answers => this.submittedAnswers = answers );
    socket.on( "uiLabels", labels => this.uiLabels = labels );
    socket.on("checkedUserAnswer", checkedAns => {
      this.checkedAnswer = checkedAns;
      console.log("tagit emot checked Answer: ",checkedAns)
    });
    socket.on("timeUp",up =>{
      console.log("tittar om timeUp")
      if(up==true){
        this.timeUp();
      }
    });
    socket.emit( "getUILabels", this.lang );
    socket.emit( "joinPoll", this.pollId );
  },
  methods: {
    submitAnswer: function (answer) { //här måste correct answer också va med, inte bara answer
      socket.emit("submitAnswer", {pollId: this.pollId, answer: answer, userId: this.userId}) // ta bort correctAnswer
      console.log('svar: ', answer)
    },
    timeUp: function(){
      socket.emit("checkUserAnswer", {pollId:this.pollId, questionNumber:this.questionNumber,userId:this.userId}) //den ska sedan vara när timern går ut
    }
  },
  // lägg till computed där vi hämtar userId

/*
computed: {
  userId() {
    return this.$route.params.userId;
  }
}
*/

  
}
</script>
