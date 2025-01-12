<template>
    <div class="addQuestionSection">
      <input 
        type="text" 
        v-model="newQuestion.q" 
        :placeholder="uiLabels.enterQuestion"
        class="questionBox"
      />
      
      <div class="answerBoxes">
        <input 
          v-model="newQuestion.a.correct" 
          :placeholder="uiLabels.enterCorrectAnswer" 
          class="correctAnswerBox" 
        />
        <input 
          v-for="(_, index) in newQuestion.a.wrong" 
          :key="'wrongAnswer' + index" 
          v-model="newQuestion.a.wrong[index]" 
          :placeholder="uiLabels.enterWrongAnswer" 
          class="wrongAnswerBox"
        />
      </div>
      
      <button 
        @click="addQuestion" 
        :disabled="isAddDisabled" 
        class="addButton">
        {{ uiLabels.addQuestion }}
      </button>
    </div>
  </template>
  
  <script>
  export default {
    name: "AddQuestionComponent",
    props: {
      uiLabels: Object,
      maxQuestions: Number,
    },
    data() {
      return {
        newQuestion: {
          q: "",
          a: {
            correct: "", 
            wrong: ["", "", ""],
          },
        },
      };
    },
    computed: {
      isAddDisabled() {
        return !this.newQuestion.q || !this.newQuestion.a.correct || this.newQuestion.a.wrong.includes("");
      },
    },
    methods: {
      addQuestion() {
        const question = { ...this.newQuestion };
        this.$emit("add-question", question);
        
        this.newQuestion = {
          q: "",
          a: {
            correct: "",
            wrong: ["", "", ""],
          },
        };
      },
    },
  };
  </script>

<style scoped>

::placeholder {
  color:#000;
  opacity:70%;
  font-style: italic;
}

.addButton {
  border: none;
  cursor: pointer;
  font-size: 20px;
  font-weight:bold;
  background-color: rgb(255, 136, 0);
  color: #1e084f;
  border-radius: 10px;
  padding: 10px 20px;
  box-shadow: 0 8px 5px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.addButton:hover {
  background-color: rgb(227, 122, 1);
  box-shadow: 0 8px 6px rgba(0, 0, 0, 0.4);
  transform: scale(1.2);
}

.questionBox {
  font-size: 20px;
  color: #000;
  background-color: #cfcfcf;
  border-radius: 10px;
  border: none;
  box-shadow: 0 8px 5px rgba(0, 0, 0, 0.1);
  width: 48vw;
  height: 10vh;
  text-align: center;
}

.answerBoxes {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2vh 1vw;
  margin: 1vh auto;
  width: 50vw;
  padding: 10px;
  font-size: 15px;
  border-radius: 10px;
  text-align: center;
  box-sizing: border-box;
}

.answerBoxes input {
  width: 100%;
  padding: 30px;
  font-size: 20px;
  border: none;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
  box-sizing: border-box;
}

.correctAnswerBox,
.correctAnswerBox::placeholder {
  color: rgb(0, 154, 5);
}

.wrongAnswerBox,
.wrongAnswerBox::placeholder {
  color: rgb(182, 2, 5);
}
</style>