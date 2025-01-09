<template>
    <div class="questionBoxes">
      <div v-if="question.isEditing">
        <p>{{ uiLabels.editingQuestion + ' ' + (index + 1) }}</p>
        <input type="text" v-model="localQuestion.q" placeholder="Edit question" />
        <p>Edit correct answer</p>
        <input type="text" v-model="localQuestion.a.correct" placeholder="Edit correct answer" id="editCorrectAnswerBox" />
        <p>Edit wrong answers</p>
        <input
          v-for="(_, i) in localQuestion.a.wrong"
          :key="'editWrongAnswer' + index + i"
          v-model="localQuestion.a.wrong[i]"
          placeholder="Edit wrong answer"
          id="editWrongAnswerBox"
        />
        <button @click="saveQuestion">{{ uiLabels.saveQuestion }}</button>
      </div>
      <div v-else>
        <p>{{ uiLabels.question + " " + (index + 1) + ": " + question.q }}</p>
        <p>{{ uiLabels.correctAnswer + ": " + question.a.correct }}</p>
        <p>{{ uiLabels.wrongAnswer + ": " + question.a.wrong }}</p>
        <button @click="editQuestion">{{ uiLabels.editQuestion }}</button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "EditQuestionComponent",
    props: {
      question: Object,
      index: Number,
      uiLabels: Object,
    },
    data() {
      return {
        localQuestion: { ...this.question },
      };
    },
    methods: {
      editQuestion() {
        this.$emit("edit-question", this.index);
      },
      saveQuestion() {
        this.$emit("save-question", this.localQuestion, this.index);
      },
    },
  };
  </script>

<style>
.questionBoxes{
  display: block;
  flex-direction:column;
  align-items: center; 
  gap: 20px; 
  margin: 20px auto; 
  width: 20vw; 
  padding: 10px;
  cursor: pointer;
  font-size: 15px;
  background-color: rgb(255, 136, 0, 0.5);
  color: #fff;
  border-radius: 10px;
  text-align: center;
  box-sizing: border-box;
}
.questionBoxes input,
.questionBoxes button{
  width: 100%;
  font-size: 15px;
  padding: 10px;
  margin-top: 5px;
  margin-bottom: 5px;
  border: none;
  border-radius: 5px;
  background-color: #cfcfcf;
  color:#1e084f;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
  box-sizing: border-box;
}
#editCorrectAnswerBox{
    color:rgb(0, 127, 4);
}
#editWrongAnswerBox{
    color: rgb(169, 0, 3);
}

.questionBoxes button{
    background-color: rgb(255, 136, 0);
}
</style>