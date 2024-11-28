<template>
<p>{{question.q}}</p>
<button v-for="a in question.a" v-on:click="selectAnswer(a)" v-bind:key="a">
  {{ a }}
</button>

<!--
<button v-bind:key="question.a[0]" v-on:click="selectAnswer(question.a[0])"> {{ question.a[0] }}</button>
<button v-bind:key="question.a[1]" v-on:click="selectAnswer(question.a[1])"> {{ question.a[1] }}</button>
<button v-bind:key="question.a[2]" v-on:click="selectAnswer(question.a[2])"> {{ question.a[2] }}</button>
<button v-bind:key="question.a[3]" v-on:click="selectAnswer(question.a[3])"> {{ question.a[3] }}</button>-->
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
      selectedAnswer:''
    }
  },
  emits: ["answer"],
  methods: {
    answer: function () {
      this.$emit("answer", this.selectedAnswer);
    },
    selectAnswer: function(answer){
        console.log(answer)
        this.selectedAnswer = answer
    }

  }
}
//ha en "selected button, så om en knapp trycks på så väljs den knappen till selected, den ändrar också färg?"
</script>