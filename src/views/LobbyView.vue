<template>
  <div>
    <div v-if="!joined">
      <input type="text" v-model="userName" placeholder="Enter your name" />
      <h1>Pick a color:</h1>
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
        <p>Some colors are already taken. Hurry up and pick you favourite!</p>
        <button @click="closePopup">X</button>
      </div>
    </div>

    <div v-if="joined">
      <p>Waiting for host to start poll</p>
      <p>Current Participants:</p>
      <ul>
        <li v-for="participant in participants" :key="participant.userId">
          {{ participant.information.name }} - Color:{{ participant.information.color }}
        </li>
      </ul>
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
        {hex: "#FFA07A"},
        {hex: "#CD5C5C"},
        {hex: "#DC143C"},
        {hex: "#20B2AA"},
        {hex: "#008B8B"},
        {hex: "#4682B4"},
      ],
      showPopup: false,
      popupShown: false,
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
  },
};
</script>

<style scoped>
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
  border-color: #000;
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
  background-color: rgb(18, 150, 22);
  color: #fff; 
  border: none;
  border-radius: 5px; 
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); 
  transition: background-color 0.3s ease; 
  width: 220px;
}

.participateButton button:hover:not(:disabled) {
  background-color: rgb(16, 115, 20); 
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
}


/*
.colorPicker li a.selected {
  border-color: #000;
  transform: scale(1.2);
}
.colorPicker li a.disabled::after {
  opacity: 1; 
  content: '✖'; 
  position: absolute;
  top: 45%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 35px; 
  color: rgb(214, 15, 15); 
}*/
</style>
