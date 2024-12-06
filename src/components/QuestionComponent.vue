<template>
<p>{{question.q}}</p>
<!--<button v-on:click="selectAnswer(question.a.correct)" v-bind:key="question.a.correct"> 
  {{ question.a.correct }}
</button>-->
<button v-for="a in question.a" v-on:click="selectAnswer(a)" v-bind:key="a">
  {{ a }}
</button>

<button v-on:click="answer">
  Submit answer
</button>
Checked answer {{ checkedAnswer }}
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
        if (this.selectedAnswer==this.question.a.correct){
          this.correctAnswer=true
        }
        this.$emit("answer", [this.selectedAnswer, this.correctAnswer]); //skicka med correctAnswer
        console.log('skickat')
      }
    },
    updateSent: function() {
      this.sent = false
      this.correctAnswer = false
    },
    selectAnswer: function(answer){
        console.log('selectanswer: ', answer)
        this.selectedAnswer = answer
    }

  }
}
//ha en "selected button, så om en knapp trycks på så väljs den knappen till selected, den ändrar också färg?"
</script>