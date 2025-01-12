<template>
  <div class="player-background">
    <div id="upperHalf">
      <div class="player-statistics">
        <div class="player-hearts">
          <img :src="this.userStats?.information?.lives >= 1 ? '/img/hjartaRod.png' : '/img/hjartaGro.png'" class="heart">
          <img :src="this.userStats?.information?.lives >= 2 ? '/img/hjartaRod.png' : '/img/hjartaGro.png'" class="heart">
        </div>
        <div class="player-time">{{ this.userStats?.information?.time }} s </div>
      </div>

    </div>
    <div>
      <AnswerOptions ref="AnswerOptions" v-bind:userId="userId" v-bind:pollId="pollId"
        @updateQuestionActive="handleQuestionActive" />
    </div>
    <div id="bottomHalf">
      <div class="help-buttons">
        <img src="/img/50-50.png" class="life-line"
          :class="{ 'dimmed': userStats?.information?.usedFiftyFifty || !questionActive }" @click="fiftyFifty" />
        <img src="/img/AskAudience.png" class="life-line"
          :class="{ 'dimmed': userStats?.information?.usedAskAudience || !questionActive }" @click="askAudience" />
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import AnswerOptions from '@/components/AnswerOptions.vue';
import io from 'socket.io-client';
const socket = io(sessionStorage.getItem("dataServer"))

export default {
  name: 'PlayerView',
  components: {
    AnswerOptions,
  },
  data: function () {
    return {
      userId: '',
      userStats: {},
      pollId: "inactive poll",
      questionNumber: null,
      questionActive: false,
      usedFiftyFiftyThisRound: false,
    }
  },
  created: function () {
    this.pollId = this.$route.params.id;
    this.userId = this.$route.params.userId;
    socket.on("uiLabels", labels => this.uiLabels = labels);
    socket.on('sendPlayerStats', user => {
      const stats = user
      if (stats.userId == this.userId) {
        this.userStats = user
      }
    })
    socket.on("gameFinished", () =>
      this.$router.push("/finalResultPlayer/" + this.pollId + "/" + this.userId)
    );
    socket.emit("getUILabels", this.lang);
    socket.emit("joinPoll", this.pollId);
    socket.emit('getPlayer', { pollId: this.pollId, userId: this.userId })
  },
  methods: {
    handleQuestionActive(isActive) {
      this.questionActive = isActive;
    },
    fiftyFifty: function () {
      if (!this.userStats.information.usedFiftyFifty && this.questionActive) {
        socket.emit('fiftyFifty', { pollId: this.pollId, userId: this.userId })
        this.usedFiftyFiftyThisRound = true
      }
    },
    askAudience: function () {
      if (!this.userStats.information.usedAskAudience && this.questionActive) {
        socket.emit('audienceAnswer', { pollId: this.pollId, userId: this.userId, usedFiftyFifty: this.usedFiftyFiftyThisRound })
      }
    },
  },
}
</script>

<style scoped>
#bottomHalf {
  width: 100%;
  background: linear-gradient(#101010, rgb(16, 16, 16, 0.95));
  height: 20%;
  position: absolute;
  bottom: 0;
}

#upperHalf {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(#101010, rgb(16, 16, 16, 0.95));
  height: 15%;
  position: absolute;
  top: 0;
  z-index: 3;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.8);
}

.player-background {
  background: radial-gradient(#1a237e, #0d1137);
  position: fixed;
  width: 100%;
  height: 100%;
}

.player-statistics {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 2vh;
  padding-bottom: 2vh;
}

.player-hearts {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 5vw 0 5vw;
}

.heart {
  height: 2em;
  margin: 5%;
}

.player-time {
  font-size: 2em;
  font-weight: bold;
  color: #f9ac33;
  margin: 0 5vw 0 5vw;
}

.help-buttons {
  display: flex;
  justify-content: center;
  align-items: center;
}

.life-line {
  height: 10vh;
  margin: 1vh 1vw 1vh 1vw;
  border: 5px solid #be8426;
  border-radius: 50%;
}

.life-line.dimmed {
  border: 5px solid #825b1c;
  filter: brightness(50%);
}
</style>