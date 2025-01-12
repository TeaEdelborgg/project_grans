<template>
  <div v-for="(a, index) in question.a" class="RectangleContainer" id="a">
    <div class="line"></div>
    <div class="borderRect">
      <div class="rectangle" :style="{ backgroundColor: a == correctAnswer && showCorrectAnswer ? '#FF851B' : 'none' }">
        <h3 :style="{ color: a == correctAnswer && showCorrectAnswer ? 'black' : 'none' }">
          <span :style="{ color: a == correctAnswer && showCorrectAnswer ? 'black' : 'none' }">{{ answersLetters[index] }}:
          </span>
          {{ a }}
        </h3>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'AnswerRectangle',
  props: {
    question: Object,
    correctAnswer: String,
    showCorrectAnswer: Boolean
  },
  data: function () {
    return {
      answersLetters: ['A', 'B', 'C', 'D']
    }
  },
}
</script>
<style>
.rectangle {
  width: 100%;
  height: 100%;
  background-color: #101c3e;
  clip-path: polygon(15% 0%, 85% 0%, 100% 50%, 85% 100%, 15% 100%, 0% 50%);
  align-content: center;
  justify-content: center;
  position: relative;
}

.borderRect {
  clip-path: polygon(15% 0%, 85% 0%, 100% 50%, 85% 100%, 15% 100%, 0% 50%);
  border: 2px solid lightyellow;
  position: absolute;
  width: 90%;
  height: 50%;
  background-color: lightyellow;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 5px lightyellow;
}

.RectangleContainer {
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: center;
  position: relative;
}

.rectangle h3 {
  margin: 0;
  color: white;
}

.rectangle span {
  color: #FF851B;
  left: 15%;
  position: absolute;
}

.line {
  height: 2px;
  width: 100%;
  background-color: lightyellow;
  box-shadow: 0 0 5px lightyellow;
}
</style>