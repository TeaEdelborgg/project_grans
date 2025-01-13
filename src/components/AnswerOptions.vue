<template>
  <div id="player-view">
    <BarComponent @sendAnswer="submitAnswer()" v-bind:sent="sent" v-bind:seeAlternatives="seeAlternatives"
      v-bind:questionActive="questionActive" v-bind:selectedAnswer="selectedAnswer"
      v-bind:questionNumber="questionNumber" v-bind:uiLabels="uiLabels" />
    <div id="container" v-if="questionActive || seeAlternatives" class="answeralternatives">
      <div class="timerBarContainer">
        <div class="timerBar" :class="{ shake: percentage <= 30 }" :style="{ width: percentage + '%' }"></div>
      </div>
      <AnswerContainer @answerSelected="answerSelected" v-bind:answerAlternatives="question.a"
        v-bind:selectedAnswer="selectedAnswer" v-bind:sent="sent" v-bind:showCorrectAnswer="showCorrectAnswer"
        v-bind:isCorrectAnswer="isCorrectAnswer" v-bind:audienceAnswer="audienceAnswer" v-bind:fiftyFify="fiftyFify"
        v-bind:questionActive="questionActive" />
    </div>
  </div>
</template>

<script>
import BarComponent from './BarComponent.vue';
import AnswerContainer from './AnswerContainer.vue';
import io from 'socket.io-client';
const socket = io(sessionStorage.getItem("dataServer"));

export default {
  name: 'AnswerOptions',
  components: {
    BarComponent,
    AnswerContainer,
  },
  props: {
    userId: String,
    quizId: String,
    uiLabels: Object,
  },
  data: function () {
    return {
      selectedAnswer: null,
      sent: false,
      fiftyFify: [],
      audienceAnswer: '',

      //till för countdownen
      question: {
        q: "",
        a: []
      },
      questionNumber: null,
      questionActive: false,
      isCorrectAnswer: false,
      showCorrectAnswer: false,
      seeAlternatives: false,
      percentage: 100,
      timeLeft: 0,
      timer: {},
    }
  },
  created: function () {
    socket.emit("joinQuiz", this.quizId);

    socket.on('sendTimer', timer => {
      this.timer = timer;
    })
    socket.on('startCountdownPlayer', question => {
      this.question = question.q;
      this.questionNumber = question.questionNumber;
      this.countdownPlayer();
    });
    socket.on('sendCorrectedUserAnswer', checkedUserAnswer => {
      this.isCorrectAnswer = checkedUserAnswer;
    });
    socket.on('sendFiftyFifty', incorrects => {
      if (incorrects.user == this.userId) {
        this.fiftyFify = incorrects.answers;
      }
    });
    socket.on('sendAudienceAnswer', audienceAnswer => {
      if (audienceAnswer.user == this.userId) {
        this.audienceAnswer = audienceAnswer.answer;
      }
    });
    socket.emit('getTimer', this.quizId)
  },
  emits: ["answer", "updateQuestionActive"],
  methods: {
    answerSelected: function (answer) {
      this.selectedAnswer = answer
    },
    submitAnswer: function () {
      socket.emit("submitAnswer", { quizId: this.quizId, questionNumber: this.questionNumber, answer: this.selectedAnswer, userId: this.userId, time: Math.ceil(this.timeLeft / 1000) });
      this.sent = true;
      this.usedFiftyFiftyThisRound = false;
    },
    countdownPlayer: function () {
      this.sent = false;
      this.selectedAnswer = null;
      this.isCorrectAnswer = false;
      this.seeAlternatives = false;
      this.showCorrectAnswer = false;
      let endQuestion = false;
      this.percentage = 100;

      let startTime = Date.now();

      let interval = setInterval(() => {
        let elapsedTime = Date.now() - startTime;

        if (!endQuestion) {
          this.timeLeft = this.timer.timerDuration - elapsedTime;
        }
        socket.on('resetTime', () => {
          this.timeLeft = 0;
          this.percentage = 0;
          endQuestion = true;
        })

        if (this.timeLeft > this.timer.timerQuestion) {
          // lägg in en countdown för innan frågan
        } else if (this.timeLeft > this.timer.timerAnswers) {
          // läs frågan på skärmen
        } else if (this.timeLeft > 0) {
          this.seeAlternatives = true
          this.percentage = Math.floor(this.timeLeft / 150);
          this.questionActive = true;
        } else {
          this.endCountdown();
          clearInterval(interval);
        }
      }, 100);
    },
    endCountdown: function () {
      if (!this.sent) {
        this.selectedAnswer = '-'
        this.submitAnswer();
      }
      this.percentage = 0
      this.questionActive = false;

      socket.emit('getPlayer', { quizId: this.quizId, userId: this.userId });
      socket.emit('getCorrectedUserAnswer', { quizId: this.quizId, questionNumber: this.questionNumber, userId: this.userId });
      this.showCorrectAnswer = true;
      setTimeout(() => {
        this.seeAlternatives = false;
      }, this.timer.timeShowCorrectAnswer)
    }
  },
  watch: {
    questionActive(newValue) {
      this.$emit('updateQuestionActive', newValue);
    }
  }
}
</script>

<style scoped>
#player-view {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 65%;
  top: 15%;
  z-index: 0;
}

#container {
  top: 15%;
  position: absolute;
  height: 90%;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
}

.answeralternative {
  background-color: #f79743;
  border-color: #FFAD66;
  border-style: solid;
  color: #FAF8F1;
  border-radius: 1em;
  margin: 2vh 2vw;
  width: 35vw;
  height: 20vh;
}

button:disabled {
  background-color: rgb(59, 59, 59);
  color: #6d6d6d;
}

.timerBarContainer {
  width: 95%;
  height: 5%;
  background-color: #e3e3e3;
  border-radius: 10px;
  overflow: hidden;
  margin: 2%;
  padding: 0;
  position: relative;
}

.timerBar {
  height: 100%;
  background-color: #FF851B;
  transition: width 0.3s linear;
}

.timerBar.shake {
  animation: shake 0.5s infinite;
}

@keyframes shake {
  0% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(10%);
    background-color: red;
    box-shadow: 0 0 20px red;
    /**blinka rött */
  }

  100% {
    transform: translateY(0);
  }
}
</style>