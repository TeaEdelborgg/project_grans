<template>
  <div>
    {{pollId}}
    <QuestionComponent ref="questionComponent" v-bind:question="question"
              v-on:answer="submitAnswer($event)"/>
    <hr>
    <span>{{submittedAnswers}}</span>
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
      submittedAnswers: {}
    }
  },
  created: function () {
    this.pollId = this.$route.params.id;
    this.userId = this.$route.params.userId;
    socket.on( "questionUpdate", q => { 
      this.question = q; 
      this.$refs.questionComponent.updateSent();              
     }); 
    socket.on( "submittedAnswersUpdate", answers => this.submittedAnswers = answers );
    socket.on( "uiLabels", labels => this.uiLabels = labels );
    socket.emit( "getUILabels", this.lang );
    socket.emit( "joinPoll", this.pollId );
  },
  methods: {
    submitAnswer: function (answer) { //här måste correct answer också va med, inte bara answer
      socket.emit("submitAnswer", {pollId: this.pollId, answer: answer[0], correctAnswer: answer[1], userId: this.userId}) // skicka userId & skicka med correct answer
      console.log('svar: ', answer)
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
