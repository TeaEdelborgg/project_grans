<template>
  <div class="player-background">
    <div class="playerView">
      <div id="upperHalf">
        <div class="player-statistics">
        <div class="player-hearts"> Liv:
          <img :src="this.userStats?.information?.lives>=1 ? '/img/hjartaRod.png':'/img/hjartaGro.png'" class="heart">
          <img :src="this.userStats?.information?.lives>=2 ? '/img/hjartaRod.png':'/img/hjartaGro.png'" class="heart">
        </div>
        <div class="player-time">Tid: {{ this.userStats?.information?.time }} sekunder </div>
      </div>
      </div>

    </div>
    <div>
      <AnswerOptions 
        ref="AnswerOptions" 
        v-bind:userId="userId" 
        v-bind:pollId="pollId"
        @updateQuestionActive="handleQuestionActive"/>
    </div>
    <div id="bottomHalf">
      <div class="help-buttons">
        <img src="/img/50-50.png" class="life-line" :class="{ 'dimmed': userStats?.information?.usedFiftyFifty || !questionActive }" @click="fiftyFifty"/>
        <img src="/img/AskAudience.png" class="life-line" :class="{ 'dimmed': userStats?.information?.usedAskAudience || !questionActive }" @click="askAudience"/>
        <!-- frågan är om man vill ha denna som en popup eller ska den lysa upp en knapp som nu? -->
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
      userId:'',
      userStats: {},
      pollId: "inactive poll",
      questionNumber: null,
      questionActive: false,
      usedFiftyFiftyThisRound: false,
      usedAskAudienceThisRound: false, // denna kanske ej behövs?
    }
  },
  created: function () {
    this.pollId = this.$route.params.id;
    this.userId = this.$route.params.userId;
    socket.on( "uiLabels", labels => this.uiLabels = labels );
    socket.on('sendPlayerStats', user => {
      const stats = user
      if (stats.userId == this.userId) {
        this.userStats = user 
      }
    })
    socket.on("gameFinished", () =>
      this.$router.push("/finalResultPlayer/" + this.pollId + "/" + this.userId)
    );
    socket.emit( "getUILabels", this.lang );
    socket.emit( "joinPoll", this.pollId );    
    socket.emit('getPlayer', {pollId: this.pollId, userId: this.userId})
  },
  methods: {
    handleQuestionActive(isActive) {
      this.questionActive = isActive;
    },
    fiftyFifty: function() {
      if (!this.userStats.information.usedFiftyFifty && this.questionActive) {
        socket.emit('fiftyFifty', {pollId: this.pollId, userId: this.userId})
        this.usedFiftyFiftyThisRound = true
      }
    },
    askAudience: function() {
      if (!this.userStats.information.usedAskAudience && this.questionActive) {
        socket.emit('audienceAnswer', {pollId: this.pollId, userId: this.userId, usedFiftyFifty: this.usedFiftyFiftyThisRound})
      }
    },
  },
}
</script>

<style scoped>
#bottomHalf{
  width: 100%;
  background-color: black;
  height: 20%;
  position: absolute;
  bottom: 0;
}
#upperHalf{
  width: 100%;
  background-color: black;
  height: 20%;
  position: absolute;
  top: 0;
  z-index: 3;
}
.player-background {
  background-color: #001F3F;
  color: #FFFFFF;
  position: fixed;
  width: 100%;
  height: 100%;
}
.player-statistics {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2%;
  padding: 2%;
  height: 50%;
  background-color: black;
}
.player-hearts {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 5vw 0 5vw;
}
.heart {
  height: 5vh;
  margin: 5%;
}
.player-time {
  border: 2px solid #cdcdcd;
}
.help-buttons {
  display: flex;
  justify-content: center;
  align-items: center;
}
.life-line {
  height: 5vh;
  margin: 5%;
  border: 5px solid #cdcdcd;
  border-radius: 50%;
}
.life-line.dimmed {
  border: 5px solid #454545;
  filter: brightness(50%);
}
</style>