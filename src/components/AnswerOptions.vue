<template>
  <div id="playerview">
    <SliderCompoment @sendAnswer="submitAnswer(selectedAnswer)" v-bind:sent="sent"
      v-bind:seeAlternatives="seeAlternatives" v-bind:questionActive="questionActive"
      v-bind:selectedAnswer="selectedAnswer" />
    <div id="container"  class="answeralternatives"> <!--v-if="questionActive || seeAlternatives"-->
      <div class="timerBarContainer">
        <div class="timerBar" :style="{ width: percentage + '%' }"></div>
      </div>
      <div id="answersContainer">
        <div v-for="(a, index) in question.a" class="containerButton">
          <div class="line"></div>
          <div class="borderRect">
            <button class="rectangle" :class="{
              selected: a === selectedAnswer,
              sended: a === selectedAnswer && sent,
              showCorrect: a === selectedAnswer && showCorrectAnswer && isCorrectAnswer,
              showIncorrect: a === selectedAnswer && showCorrectAnswer && !isCorrectAnswer,
              showAudienceAnswer: a === audienceAnswer,
            }" v-on:click="selectAnswer(a)" v-bind:key="a" :disabled="isDisabled(a)">
                <div class="textContainer"> 
                  <span class="answerLetters"> {{ answerLetters[index] }}: </span>
                  <h3> {{ a }} </h3>
                </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SliderCompoment from './SliderCompoment.vue';
import io from 'socket.io-client';
const socket = io(sessionStorage.getItem("dataServer"));

export default {
  name: 'AnswerOptions',
  components: {
    SliderCompoment,
  },
  props: {
    userId: String,
    pollId: String,
  },
  data: function () {
    return {
      selectedAnswer: null,
      sent: false,
      fiftyFify: [],
      audienceAnswer: '',
      answerLetters: ['A', 'B', 'C', 'D'],

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
    }
  },
  created: function () {
    socket.emit("joinPoll", this.pollId);

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
  },
  emits: ["answer", "updateQuestionActive"],
  methods: {
    selectAnswer: function (answer) {
      if (this.questionActive && !this.sent) {
        this.selectedAnswer = answer;
      }
    },
    isDisabled: function (a) {
      if (this.fiftyFify.length > 0) {
        for (let i = 0; i < 2; i++) {
          if (a == this.fiftyFify[i]) {
            return true;
          }
        }
        return false;
      }
    },
    submitAnswer: function (answer) {
      socket.emit("submitAnswer", { pollId: this.pollId, questionNumber: this.questionNumber, answer: answer, userId: this.userId, time: Math.ceil(this.timeLeft / 1000) });
      this.sent = true;
      this.usedFiftyFiftyThisRound = false;
    },
    countdownPlayer: function () {
      this.sent = false;
      this.selectedAnswer = null;
      this.isCorrectAnswer = false;
      this.seeAlternatives = false;
      this.showCorrectAnswer = false;
      this.percentage = 100;

      let startTime = Date.now();
      let timerDuration = 18000;
      let timerQuestion = 15000;
      let timerAnswer = 10000;
      let endQuestion = false;

      let interval = setInterval(() => {
        let elapsedTime = Date.now() - startTime;

        if (!endQuestion) {
          this.timeLeft = timerDuration - elapsedTime;
        }
        socket.on('resetTime', () => {
          this.timeLeft = 0;
          this.percentage = 0;
          endQuestion = true;
        })

        if (this.timeLeft > timerQuestion) {
          // lägg in en countdown för innan frågan
        } else if (this.timeLeft > timerAnswer) {
          // läs frågan på skärmen
        } else if (this.timeLeft > 0) {
          this.seeAlternatives = true
          this.percentage = Math.floor(this.timeLeft / 100);
          this.questionActive = true;
        } else {
          this.endCountdown();
          clearInterval(interval);
        }
      }, 100);
    },
    endCountdown: function () {
      if (!this.sent) {
        this.submitAnswer('-');
      }
      this.percentage = 0
      this.questionActive = false;

      socket.emit('getPlayer', { pollId: this.pollId, userId: this.userId });
      socket.emit('getCorrectedUserAnswer', { pollId: this.pollId, questionNumber: this.questionNumber, userId: this.userId });
      this.showCorrectAnswer = true;
      setTimeout(() => {
        this.seeAlternatives = false;
      }, 5000)
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
#playerview {
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

#answersContainer {
  bottom: 0;
  width: 100%;
  height: 93%;
  display: grid;
  grid-template-columns: 50% 50%;
  grid-template-rows: 50% 50%;
  grid-row: auto auto;
  justify-content: center;
  position: absolute;
  margin: auto;
}

.line {
  height: 2px;
  width: 100%;
  background-color: lightyellow;
  box-shadow: 0 0 5px lightyellow;
}

.containerButton {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
}

.rectangle {
  width: 100%;
  height: 100%;
  background-color: #101c3e;
  color: #e3e3e3;
  clip-path: polygon(15% 0%, 85% 0%, 100% 50%, 85% 100%, 15% 100%, 0% 50%);
  position: relative;
  font-weight: bold;
}

.textContainer{
  position: absolute;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-content: center;
  justify-content: center;
  text-align: center;
  align-items: center;
  transform: translateY(-50%);
}

.rectangle h3 {
  width: 75%;
  margin:0;
  position: relative;
  font-size: 1.2em;
  overflow-wrap: break-word;
}

.answerLetters {
  width: 5%;
  color: #FF851B;
  left: 0;
  position: relative;
  margin:0;
  font-size: 1.2em;
  text-align: left;
}

.borderRect {
  clip-path: polygon(15% 0%, 85% 0%, 100% 50%, 85% 100%, 15% 100%, 0% 50%);
  border: 2px solid lightyellow;
  position: absolute;
  width: 90%;
  height: 70%;
  background-color: lightyellow;
  box-shadow: 0 0 5px lightyellow;
}

.showAudienceAnswer {
  background-color: rgb(107, 124, 255);
  color: black;
}

button:disabled {
  background-color: grey;
}

.selected {
  background-color: #f9ac33;
  color: #e3e3e3;
}

.sended {
  background-color: #e07618;
  color: #e3e3e3;
}

.showCorrect {
  background-color: #56c763;
  color: #e3e3e3;
}

.showIncorrect {
  background-color: #fd4d47;
  color: #e3e3e3;
}

.timerBarContainer {
  width: 95%;
  /*height: 20px;*/
  height: 5%;
  background-color: #e3e3e3;
  border-radius: 10px;
  overflow: hidden;
  /*margin: 3vh 0;*/
  margin: 2%;
  padding: 0;
  position: relative;
}

.timerBar {
  height: 100%;
  background-color: #FF851B;
  transition: width 0.3s linear;
}
</style>