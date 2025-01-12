<template>
  <div id="dimmed-overlay"></div>
  <div id="question-frame">
    <div id="progress-bar">
      <div id="progress" :style="{ width: percentage + '%', animation: percentage <= 30 ? 'shake 0.5s infinite' : 'none' }">
      </div>
    </div>
    <div v-if="showQuestion">
      <QuestionComponent v-bind:question="question" v-bind:currentValue="currentValue"
        v-bind:questionActive="questionActive" v-bind:correctAnswer="correctAnswer"
        v-bind:showCorrectAnswer="showCorrectAnswer"></QuestionComponent>
    </div>
    <div v-if="!showQuestion">
      <SpeakBubble v-bind:uiLabels="uiLabels" v-bind:timeLeftBeforeQuestion="timeLeftBeforeQuestion"></SpeakBubble>
    </div>
    <div v-if="showQuestion && questionActive == false">
      <h1>{{ timeLeftBeforeAnswers }}</h1>
    </div>
  </div>
</template>

<script>
import io from 'socket.io-client';
const socket = io(sessionStorage.getItem("dataServer"))
import SpeakBubble from '@/components/SpeakBubble.vue';
import QuestionComponent from './QuestionComponent.vue';


export default {
  name: 'QuestionCountDown',
  emits: ['countDownOverSend'],
  components: {
    SpeakBubble,
    QuestionComponent
  },
  props: {
    question: Object,
    uiLabels: Object,
    currentValue: Number,
    correctAnswer: String,
    timer:Object
  },
  data: function () {
    return {
      pollId: "",
      questionActive: false,
      timeLeftBeforeQuestion: 0,
      timeLeftBeforeAnswers: 0,
      percentage: 100,
      showQuestion: false,
      showCorrectAnswer: false
    }
  },
  created: function () {
    this.pollId = this.$route.params.id;
    socket.emit("joinPoll", this.pollId);
  },
  mounted() {
    this.countdownResult()
  },
  methods: {
    countdownResult: function () {
      let startTime = Date.now();
      let timeLeft = 0;
      let endQuestion = false;

      let interval = setInterval(() => {
        if (!endQuestion) {
          let elapsedTime = Date.now() - startTime;
          timeLeft = this.timer.timerDuration - elapsedTime;

          socket.on('resetTime', () => {
            timeLeft = 0;
            endQuestion = true;
            this.endCountdown()
            clearInterval(interval)
          })
          if (timeLeft > this.timer.timerQuestion) {
            this.timeLeftBeforeQuestion = Math.floor((4000 - elapsedTime) / 1000);
          } else if (timeLeft > this.timer.timerAnswers) {
            this.showQuestion = true
            this.timeLeftBeforeAnswers = Math.floor((9000 - elapsedTime) / 1000)
          }
          else if (timeLeft > 0) {
            this.questionActive = true;
            this.percentage = Math.floor((timeLeft) / 150);
          }
          else {
            this.endCountdown()
            clearInterval(interval)
          }
        }
      }, 100);
    },
    endCountdown: function () {
      this.showCorrectAnswer = true
      this.percentage = 0;
      setTimeout(() => {
        this.$emit("countDownOverSend")
      }, this.timer.timeShowCorrectAnswer)
    }
  }
}
</script>
<style>
@keyframes showAnswers {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

#dimmed-overlay {
  position: fixed;
  opacity: 0.5;
  background-color: black;
  top: 0;
  left: 0;
  z-index: 2;
  height: 100%;
  width: 100%;
}

#question-frame {
  width: 100%;
  height: 100%;
  overflow: hidden;
  margin: auto;
  z-index: 3;
  background: linear-gradient(45deg, #0f131f, #3a3790, #0f131f);
  position: absolute;
}

#question-frame h1,h2 {
  color: White;
}

#progress-bar {
  width: 100%;
  overflow: hidden;
  height: 20px;
  background-color: lightgray;
  margin-left: auto;
  margin-right: auto;
}

#progress {
  width: 100%;
  height: 100%;
  background-color: #FF851B;
  transition: width 0.1s;
}

@keyframes shake {
  0% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(10%);
    background-color: red;
    box-shadow: 0 0 20px red;
  }

  100% {
    transform: translateY(0);
  }
}
</style>
