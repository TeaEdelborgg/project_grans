<template>
  <div id="background">
    <div id="row-container">
      <Frame v-on:countDownOver="countDownOver" v-bind:amountOfQuestions="amountOfQuestions"
        v-bind:correctAnswer="correctAnswer" v-bind:questionNumber="questionNumber" v-bind:question="question"
        v-bind:uiLabels="uiLabels" v-bind:questionActive="questionActive" v-bind:moneyBoxes="moneyBoxes"
        v-bind:moneyValues="moneyValues" v-bind:participants="participants" v-bind:timer="timer"></Frame>
      <HostPlayer v-bind:questionActive="questionActive"></HostPlayer>
    </div>
    <br>
    <div id="pedestaler">
      <PlayerPedestal v-if="participants.length > 0 && pedestalLight?.length > 0" v-for="(player, index) in participants"
        v-bind:questionNumber="questionNumber" v-bind:uiLabels="uiLabels" v-bind:player="player"
        v-bind:questionActive="questionActive" v-bind:lightPedestal="pedestalLight?.[index]" :key="player.id" />
    </div>
  </div>
</template>

<script>

// @ is an alias to /src
import io from 'socket.io-client';
const socket = io(sessionStorage.getItem("dataServer"));
import PlayerPedestal from '@/components/PlayerPedestal.vue';
import HostPlayer from '@/components/hostPlayer.vue';
import Frame from '@/components/Frame.vue';

export default {
  name: 'GameView',
  components: {
    PlayerPedestal,
    HostPlayer,
    Frame
  },
  data: function () {
    return {
      uiLabels: {},
      lang: localStorage.getItem("lang") || "en",
      quizId: "",
      question: {},
      participants: [],
      questionActive: false,
      amountOfQuestions: 0,
      userId: '',
      moneyBoxes: [],
      moneyValues: [],
      questionNumber: 0,
      correctAnswer: '',
      pedestalLight: [],
      timer: {}
    }
  },
  created: function () {
    this.quizId = this.$route.params.id
    socket.on("uiLabels", labels => this.uiLabels = labels);

    socket.on("updatePedestalLight", p => {
      this.pedestalLight = p;
    })

    socket.on("updateAfterQuestion", d => {
      this.participants = d.participants
      this.moneyBoxes = d.levelBoxes
    })

    socket.on('startCountdownResults', data => {
      this.question = data.q;
      this.questionNumber = data.questionNumber
      this.correctAnswer = data.correctAnswer
      this.questionActive = true
      this.pedestalLight = data.pedestalLight
    });
    socket.on('loadStats', d => {
      this.amountOfQuestions = d.amountOfQuestions
      this.moneyValues = d.levelValues
      this.moneyBoxes = d.levelColors
      this.participants = d.participants
      this.pedestalLight = d.pedestalLight
      this.timer = d.timer
    })

    socket.on('gameFinished', () =>
      this.$router.push('/result/' + this.quizId)
    )

    socket.emit("getUILabels", this.lang);
    socket.emit("joinQuiz", this.quizId);
    socket.emit('getStats', this.quizId);

  },
  methods: {
    countDownOver: function () {
      setTimeout(() => {
        socket.emit("getAllAnswers", this.quizId)
        this.questionActive = false
      }, 2000)
    }
  }
}
</script>

<style>
#pedestaler {
  width: 100%;
  display: flex;
  justify-content: space-evenly;
  height: 25%;
  bottom: 0;
  position: relative;
}

#row-container {
  display: flex;
  flex-direction: row;
  height: 75%;
  position: relative;
}

#background {
  background: radial-gradient(#1a237e, #0d1137);
  background-size: cover;
  height: 100vh;
  width: 100vw;
  position: fixed;
  z-index: 1;
  display: flex;
  flex-direction: column;
}
</style>
