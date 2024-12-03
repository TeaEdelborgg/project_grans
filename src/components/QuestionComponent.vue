<template>
<p>{{question.q}}</p>
<button v-on:cick="selectAnswer(question.a.correct)" v-bind:key="question.a.correct"> 
  {{ question.a.correct }}
</button>
<button v-for="a in question.a.wrong" v-on:click="selectAnswer(a)" v-bind:key="a">
  {{ a }}
</button>

<button v-on:click="answer">
  Submit answer
</button>
</template>

<script>
export default {
  name: 'QuestionComponent',
  props: {
    question: Object
  },
  data: function(){
    return{
      selectedAnswer:'',
      sent:false, 
      correctAnswer:false
    }
  },
  emits: ["answer"],
  methods: {
    answer: function () {
      if (!this.sent){
        this.sent=true
        this.$emit("answer", this.selectedAnswer);
        console.log('skickat')
      }
    },
    updateSent: function() {
      this.sent = false
    },
    selectAnswer: function(answer){
        console.log(answer)
        this.selectedAnswer = answer
    }

  }
}
//ha en "selected button, så om en knapp trycks på så väljs den knappen till selected, den ändrar också färg?"
</script>