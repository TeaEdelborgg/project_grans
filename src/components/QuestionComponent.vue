<template>
<p>{{question.q}}</p>
<button> 
  {{ question.a.correct }}
</button>
<button v-for="a in question.a.wrong" v-on:click="selectAnswer(a)" v-bind:key="a">
  {{ a }}
</button>

<button v-on:click="answer">
  Submitt answer
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
      sent:false
    }
  },
  emits: ["answer"],
  methods: {
    answer: function () {
      if (!this.sent){
        this.sent=true
        this.$emit("answer", this.selectedAnswer);
      }
    },
    selectAnswer: function(answer){
        console.log(answer)
        this.selectedAnswer = answer
    }

  }
}
//ha en "selected button, så om en knapp trycks på så väljs den knappen till selected, den ändrar också färg?"
</script>