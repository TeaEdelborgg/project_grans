<template>
  <div class="player-background">
    <TopPlayerComponent v-bind:userStats="userStats" />
    <AnswerOptions v-bind:userId="userId" v-bind:quizId="quizId" v-bind:uiLabels="uiLabels"
      @updateQuestionActive="handleQuestionActive" />
    <BottomPlayerComponent v-bind:userStats="userStats" v-bind:questionActive="questionActive"
      @useAskAudience="askAudience" @useFiftyFifty="fiftyFifty" />
  </div>
</template>

<script>
// @ is an alias to /src
import TopPlayerComponent from '@/components/TopPlayerComponent.vue';
import AnswerOptions from '@/components/AnswerOptions.vue';
import BottomPlayerComponent from '../components/BottomPlayerComponent.vue';
import io from 'socket.io-client';
const socket = io(sessionStorage.getItem("dataServer"))

export default {
  name: 'PlayerView',
  components: {
    AnswerOptions,
    TopPlayerComponent,
    BottomPlayerComponent,
  },
  data: function () {
    return {
      uiLabels: {},
      userId: '',
      userStats: {},
      quizId: "inactive quiz",
      questionNumber: null,
      questionActive: false,
      usedFiftyFiftyThisRound: false,
    }
  },
  created: function () {
    this.quizId = this.$route.params.id;
    this.userId = this.$route.params.userId;
    socket.on("uiLabels", labels => this.uiLabels = labels);
    socket.on('sendPlayerStats', user => {
      const stats = user
      if (stats.userId == this.userId) {
        this.userStats = user
      }
    })
    socket.on("gameFinished", () =>
      this.$router.push("/resultPlayer/" + this.quizId + "/" + this.userId)
    );
    socket.emit("getUILabels", this.lang);
    socket.emit("joinPoll", this.quizId);
    socket.emit('getPlayer', { quizId: this.quizId, userId: this.userId })
  },
  methods: {
    handleQuestionActive(isActive) {
      this.questionActive = isActive;
    },
    fiftyFifty: function () {
      if (!this.userStats.information.usedFiftyFifty && this.questionActive) {
        socket.emit('fiftyFifty', { quizId: this.quizId, userId: this.userId })
        this.usedFiftyFiftyThisRound = true
      }
    },
    askAudience: function () {
      if (!this.userStats.information.usedAskAudience && this.questionActive) {
        socket.emit('audienceAnswer', { quizId: this.quizId, userId: this.userId, usedFiftyFifty: this.usedFiftyFiftyThisRound })
      }
    },
  },
}
</script>

<style>
.barRim {
  width: 100%;
  height: 15%;
  bottom: 0;
  background: linear-gradient(black 0% 2%, #959595 30% 32%, black 60% 100%);
  position: absolute;
  z-index: 4;
}

.player-background {
  background: radial-gradient(#1a237e, #0d1137);
  position: fixed;
  width: 100%;
  height: 100%;
}
</style>