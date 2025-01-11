<template>
  <div id="question">
    <div class="line"></div>
    <ValueRectangle v-bind:currentValue="currentValue"></ValueRectangle>
    <h1>{{question.q}}</h1>
    <div class="line"></div>
  </div>
  <br>
  <div v-if="questionActive" id="AnswerGrid">
    <AnswerRectangle v-bind:question="question" v-bind:correctAnswer="correctAnswer" v-bind:showCorrectAnswer="showCorrectAnswer"></AnswerRectangle>
  </div>  
</template>
<script>
import AnswerRectangle from './AnswerRectangle.vue';
import ValueRectangle from './ValueRectangle.vue';

export default{
        name:'QuestionComponent',
        props:{
            question: Object,
            currentValue: Number,
            questionActive: Boolean,
            correctAnswer: String,
            showCorrectAnswer:Boolean,
        },
        components:{
          AnswerRectangle,
          ValueRectangle
        },
        data: function(){
            return{
              
            }
        },
        methods:{
           
        }
}
</script>
<style>
.line{
  height: 2px;
  width: 100%;
  background-color: lightyellow;
  box-shadow: 0 0 5px lightyellow;
}
#question{
  width: 100%;
  height: 100%;
  position: relative;
  margin-top:10%;
  background-color: #101c3e;
}
#AnswerGrid{
  bottom:5%;
  width: 100%;
  height: 40%;
  display: grid;
  grid-template-columns: 50% 50%;
  grid-row: 50% 50%;
  justify-content: center;
  position:absolute;
  margin: auto;
  animation: showAnswers 0.5s;
}
</style>