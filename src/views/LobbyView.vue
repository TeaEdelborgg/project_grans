<template>
  <div>
    {{ pollId }}
    <div v-if="!joined">
      <input type="text" v-model="userName" placeholder="Enter your name" />

      <div>
        <ul class="colorPicker">
          <li v-for="color in colors" :key="color.hex">
            <a
              href="#"
              :style="{ background: color.hex }"
              v-on:click="setColor(color.hex)"
              :class="{ selected: selectedColor === color.hex, disabled: isColorDisabled(color.hex) }">
            </a>
          </li>
        </ul>
        <input type="hidden" v-model="selectedColor" />
      </div>

      <button v-on:click="participateInPoll" :disabled="!userName || isColorDisabled(selectedColor) || selectedColor ==='#ff0000'">
        {{ uiLabels.participateInPoll || "Join Poll" }}
      </button>
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
    };
  },
  created() {
    this.pollId = this.$route.params.id;
    socket.on("uiLabels", (labels) => (this.uiLabels = labels));
    socket.on("participantsUpdate", (p) => {
      this.participants = p;
    });
    socket.on("startPoll", () =>
      this.$router.push("/poll/" + this.pollId + "/" + this.userID)
    );
    socket.on("colorSelectionUpdate", (updatedParticipants) => {
      this.participants=updatedParticipants;
    })
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
}};
</script>

<style scoped>
.colorPicker {
  list-style: none;
  display: flex;
  gap: 5px;
}

.colorPicker li a {
  display: block;
  height: 30px;
  width: 30px;
  border: 2px solid transparent;
  cursor: pointer;
}

.colorPicker li a.selected {
  border-color: #000;
}

.colorPicker li a.disabled {
  opacity: 0.5;
  pointer-events: none;
}
</style>
