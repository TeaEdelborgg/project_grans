<template>
  <div class="container">
    <div v-if="!joined">
      <input type="text" v-model="userName" :placeholder="uiLabels.enterName" maxlength="10"/>
      <h1>{{uiLabels.pickColor}}</h1>
      <div>
        <ul class="colorPicker">
          <li v-for="color in colors" :key="color.hex">
            <a
              href="#"
              :style="{ background: color.hex }"
              v-on:click="setColor(color.hex, $event)"
              :class="{ selected: selectedColor === color.hex, disabled: isColorDisabled(color.hex) }">
            </a>
          </li>
        </ul>
        <input type="hidden" v-model="selectedColor" />
      </div>

      <div class="participateButton">
        <button v-on:click="participateInPoll" :disabled="!userName || isColorDisabled(selectedColor) || selectedColor ==='#ff0000'">
          {{ uiLabels.participateInPoll || "Join Poll" }}
        </button>
      </div>

      <div v-if="showPopup" class="popup">
        <p>{{ uiLabels.colorPopup }}</p>
        <button @click="closePopup">X</button>
      </div>
      <!--<div v-if="isLobbyFull()">
        <h3>lobby is full please try again later</h3>
        <button @click="closeLobbyFullPopup">X</button>
      </div>-->
      <div v-if="isLobbyFull()" class="lobbyFullPopup">
        <h3>{{ uiLabels.lobbyfull }}</h3>
      </div>
    </div>

    <div v-if="joined">
      <p class="waiting-message">{{uiLabels.waitingMessage}}<span class="dots"></span></p>
      <div class="waitingLobby">
        <p>{{uiLabels.currentParticipants}}</p>
      
      <ul class="lobbyParticipants">
        <li v-for="participant in participants" 
        :key="participant.userId" 
        :style="{ color: participant.information.color, borderColor: participant.information.color }"
        class="participantColor">
          {{ participant.information.name }}
        </li>
      </ul>
      </div>

      <button v-if="!gameRules" v-on:click="gameRules = true" class="rulebutton">{{ uiLabels.rules }}</button>
      <div :class="['overlay', {show:gameRules}]" v-on:click="closeGameRules"></div>
      <div :class="['RulesPopup', {show:gameRules}]">
        <h2>{{uiLabels.rulesTitle}}</h2>
          <li>{{uiLabels.rulesli1}}</li>
          <li>{{uiLabels.rulesli2}}</li>
          <li>{{uiLabels.rulesli3}}</li>
          <li>{{uiLabels.rulesli4}}</li>
          <li>{{ uiLabels.rulesli5 }}</li>
        <button @click="closeGameRules">X</button>
      </div>
    </div>
  </div>
</template>

<script>
import io from 'socket.io-client';
//const socket = io("localhost:3000");
const socket = io(sessionStorage.getItem("dataServer")) //for mobile phones osv

export default {
  name: 'LobbyView',
  data() {
    return {
      userID: "",
      userName: "",
      pollId: "inactive poll",
      uiLabels: {},
      joined: false,
      lang: localStorage.getItem("lang") || "en",
      selectedColor: "#ff0000",
      participants: [],
      colors: [
        {hex: "#0015ff"},
        {hex: "#ff00a1"},
        {hex: "#90fe00"},
        {hex: "#8400ff"},
        {hex: "#00fff7"},
        {hex: "#ff7300"},
      ],
      showPopup: false,
      popupShown: false,
      gameRules: false,
    };
  },
  created() {
    this.pollId = this.$route.params.id;
    socket.on("uiLabels", (labels) => (this.uiLabels = labels));
    socket.on("participantsUpdate", (p) => {
      this.participants = p;
      this.checkForDisabledColors(); 
    });
    socket.on("startPoll", () =>
      this.$router.push("/poll/" + this.pollId + "/" + this.userID)
    );
    socket.on("colorSelectionUpdate", (updatedParticipants) => {
      this.participants = updatedParticipants;
      this.checkForDisabledColors();
    });
    socket.emit("joinPoll", this.pollId);
    socket.emit("getParticipants", this.pollId)
    socket.emit("getUILabels", this.lang);
  },
  methods: {
    participateInPoll() {
      this.userID = Math.ceil(Math.random() * 1000000); // Generate unique ID
      socket.emit("participateInPoll", {
        pollId: this.pollId,
        name: this.userName,
        userId: this.userID,
        color: this.selectedColor, //skickar färg t admin
      });
      this.joined = true;
      this.gameRules = true
    },
    setColor(color) {
      if (this.isColorDisabled(color)) return;
      this.selectedColor = color;
      socket.emit("selectColor", {
        pollId:this.pollId,
        color,
        userId: this.userID,
      });
    },
    isColorDisabled(color) {
      return this.participants.some(
        (participant) => participant.information.color === color
      );
    },
    checkForDisabledColors() {
      if (!this.popupShown && this.colors.some(color => this.isColorDisabled(color.hex))) {
        this.showPopup = true; 
        this.popupShown = true; 
      }
    },
    closePopup() {
      this.showPopup = false;
    },
    toggleGameRules() {
      this.gameRules = !this.gameRules;
    },
    closeGameRules() {
      this.gameRules = false;
    },
    isLobbyFull() {
    return this.participants.length === 6
    }
  },
};
</script>

<style scoped>
.container {
  display:block; 
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh; 
  width: 100vw; 
  background: linear-gradient(135deg, #0a0347, #3c298f); 
  background-attachment: fixed; 
  background-size: cover; 
  margin: 0; 
  padding: 0; 
  text-align: center;
  box-sizing: border-box; 
}
.colorPicker {
  list-style: none;
  display: flex;
  gap: 15px;
  justify-content: center; 
  margin-top: 20px;
  margin-left: -30px;
}

.colorPicker li a {
  display: block;
  height: 60px;
  width: 60px;
  border: 3px solid transparent;
  cursor: pointer;
  border-radius: 40%;
}

.colorPicker li a:hover {
  /*border-color: #000;*/
  transform: scale(1.2);
  transition: transform 0.2s ease;
}

.colorPicker li a.selected {
  border-color: #ffffff;
}

.colorPicker li a.disabled {
  opacity: 0.4;
  pointer-events: none;
  position: relative;
  transform: scale(0.7);
  border: none;
}

input[type="text"] {
  margin: 40px auto; 
  margin-top: 110px;
  padding: 15px; 
  font-size: 30px; 
  text-align: center;
  border: 2px solid #000000;
  border-radius: 40px; 
  width: 35%; 
  height: 50px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); 
  background-color: #ffffff;
}

input[type="text"]:focus::placeholder {
  opacity: 0; 
  transition: opacity 0.1s ease-in-out;
}

input[type="text"]:hover {
  background-color: #e7e7e7;
  transition: background-color 0.3s ease;
}

.participateButton button {
  display: block;
  margin: 30px auto; 
  padding: 15px 40px; 
  font-size: 18px; 
  background-color: rgb(255, 136, 0);
  color: #1e084f; 
  border: none;
  border-radius: 5px; 
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); 
  transition: background-color 0.3s ease; 
  width: 235px;
  font-weight: bold;
}

.participateButton button:hover:not(:disabled) {
  background-color: rgb(227, 122, 1);
  box-shadow: 0 8px 6px rgba(0, 0, 0, 0.4); 
}
.participateButton button:disabled {
  filter: white;
  cursor: default; 
  opacity: 50%;
}

@keyframes slideIn {
  0% {
    top: -80px; 
  }
  100% {
    top: 2%;
  }
}
.popup {
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  background: rgb(192, 5, 5);
  padding: 5px;
  box-shadow: 0 8px 10px rgba(0, 0, 0, 0.4);
  animation: slideIn 0.5s ease-in-out forwards; 
  border-radius: 10px;
  width: 250px;
  height: 60px;
}
.popup p{
  font-size: 15px;
  padding-right: 24px;
  position: absolute;
  top: 2px;
}
.popup button{
  background: rgb(192, 5, 5);
  cursor: pointer;
  position: absolute; 
  top: 9px; 
  right: 10px; 
}

h1 {
  font-size: 20px;
  color:#ddd;
}

.rulebutton {
  padding: 10px 20px;
  font-size: 18px;
  font-weight: bold;
  color: #1e084f; 
  background-color: #ff9100; 
  border: none;
  border-radius: 8px; 
  cursor: pointer;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2); 
  transition: background-color 0.3s ease, transform 0.2s ease; 
}
.rulebutton:hover {
  background-color: #cf6e00; 
  transform: scale(1.05); 
}

.RulesPopup {
  position: fixed;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0); 
  background: rgba(255, 255, 255, 0.9);
  padding: 20px;
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.4);
  width: 80%;
  max-width: 400px;
  border-radius: 10px;
  z-index: 100;
  opacity: 0; 
  transition: transform 0.4s ease, opacity 0.4s ease; 
}

.RulesPopup.show {
  transform: translate(-50%, -50%) scale(1);
  opacity: 1; 
}

.RulesPopup button {
  background: rgb(255, 255, 255);
  color: rgb(0, 0, 0);
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  position: absolute;
  top: 5px;
  right: 5px;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.842);
  opacity: 0;
  transition: opacity 0.4s ease; 
  pointer-events: none; 
  z-index: 100;
}

.overlay.show {
  opacity: 1;
}

.RulesPopup li {
  text-align: left;
}

.lobbyFullPopup {
  position: fixed; 
  top: 0;
  left: 0;
  width: 100%;
  height: 100%; 
  background-color: #000000d5; 
  z-index: 100; 
  display: flex; 
  justify-content: center;
  align-items: center;
}
h3 {
  color: #fff;
  font-size: 200%;
}

.lobbyParticipants {
  list-style: none;
  padding: 0;
}

.participantColor {
  display: inline-block;
  padding: 10px 20px;
  margin: 16px;
  border: 2px solid;
  border-radius: 20px; 
  font-weight: bold;
  text-align: center;
  font-size: 25px;
  box-shadow: 0 0 5px currentColor, 0 0 5px currentColor, 0 0 20px currentColor;
}

.waitingLobby {
  text-align: center;
  padding: 20px;
  background: linear-gradient(135deg, #1e0880,  #06012e); 
  border: 1px solid #ddd;
  border-radius: 10px;
  width: 80%;
  height: 200px;
  margin: 60px auto;
  margin-top: 60px;
  margin-bottom: 35px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
.waitingLobby p {
  font-size: 1rem;
  color: #edededec;
  font-family: Verdana, Tahoma, sans-serif;
}

.waiting-message {
  font-size: 1.2rem;
  color: #e7e7e7ee;
  margin-top: 0px;
  padding-top:50px;
  font-family: Verdana, Tahoma, sans-serif;
}

.dots::after {
  content: "";
  display: inline-block;
  animation: dots 2s steps(3, end) infinite;
}

@keyframes dots {
  0% {
    content: "";
  }
  33% {
    content: ".";
  }
  66% {
    content: "..";
  }
  100% {
    content: "...";
  }
}
@media (max-width: 480px) {
  .colorPicker li a {
    height: 5vh; 
    width: 10vw;
  }
  .colorPicker {
    gap: 4%;
  }
  input[type="text"] {
    font-size: 16px; 
    height: 20px;
    width: 50%;
    margin-top: 57%;
    margin-bottom: 8%;
  }
  .participateButton button {
    font-size: 14px; 
    width: 140px;
    padding: 8px 20px;
    margin-top: 20%;
  }
  .waiting-message {
    font-size: 80%;
    margin-top: 0%;
    padding-top:50%;
    font-family: Verdana, Tahoma, sans-serif;
  }
  .waitingLobby {
    margin-top: 0%;
  }
  .participantColor {
    padding: 8px 16px;
    margin: 1vw;
    font-size: 70%;
  }
  .rulebutton {
    font-size: 14px; 
    width: 110px;
    padding: 8px 20px;
  }
  .popup {
    margin-top: 17%;
    width: 85vw;
    z-index: 100;
  }
  .popup button {
    right: 1.5%;
  }
  .RulesPopup li {
    font-size: 80%;
  }

}
</style>
