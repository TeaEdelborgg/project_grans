<template>
  <div>
    {{ pollId }}
    <div v-if="!joined">
      <input type="text" v-model="userName" placeholder="Enter your name" />
      <button v-on:click="participateInPoll">
        {{ uiLabels.participateInPoll || "Join Poll" }}
      </button>
    </div>
    <div v-if="joined">
      <p>Waiting for host to start poll</p>
      <div class="boxes">
        <div 
          v-for="(box, index) in playerBoxes" 
          :key="index" 
          class="box" 
          :class="{ taken: box.taken }" 
          @click="selectBox(index)"
        >
          {{ box.label }}
        </div>
      </div>
      <p>Current Participants:</p>
      <ul>
        <li v-for="participant in participants" :key="participant.userId">
          {{ participant.information.name || `Player ${participant.userId}` }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import io from 'socket.io-client';
const socket = io("localhost:3000");

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
      participants: [],
      playerBoxes: [
        { taken: false, label: "Box 1", userId: null },
        { taken: false, label: "Box 2", userId: null },
        { taken: false, label: "Box 3", userId: null },
        { taken: false, label: "Box 4", userId: null },
      ],
      selectedBox: null,
    };
  },
  created() {
    this.pollId = this.$route.params.id;
    socket.on("uiLabels", (labels) => (this.uiLabels = labels));
    socket.on("participantsUpdate", (p) => {
      this.participants = p;
      this.updatePlayerBoxes();
    });
    socket.on("boxStatesUpdate", (boxStates) => {
      this.syncPlayerBoxes(boxStates);
    });
    socket.on("startPoll", () =>
      this.$router.push("/poll/" + this.pollId + "/" + this.userID)
    );
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
      });
      this.joined = true;
    },
    selectBox(index) {
      if (this.selectedBox !== null) {
        console.log("you can only select one box");
        return;
      }
      const selecterbox = this.playerBoxes[index];
      if (!selecterbox.taken) { 
        selecterbox.taken = true;
        selecterbox.label = this.userName || `Player ${this.userID}`;
        selecterbox.userId = this.userID;
        this.selectedBox = index;

        socket.emit("selectBox", {
          pollId: this.pollId,
          boxIndex: index,
          userId: this.userID,
          label: selecterbox.label,
        });
      }
    },
    updatePlayerBoxes() {
      this.playerBoxes.forEach((box, index) => {
        const takenBy = this.participants.find((p) => p.selectedBox === index);
        if (takenBy) {
          box.taken = true;
          box.label = takenBy.information.name || `Player ${takenBy.userId}`;
          box.userId = takenBy.userId;
        } else {
          box.taken = false;
          box.label = `Box ${index + 1}`;
          box.userId = null;
        }
      });
    },
    syncPlayerBoxes(boxStates) {
    this.playerBoxes.forEach((box, index) => {
      const state = boxStates.find((s) => s.boxIndex === index);
      if (state) {
        box.taken = true;
        box.label = state.label;
        box.userId = state.userId;
      } else {
        box.taken = false;
        box.label = `Box ${index + 1}`;
        box.userId = null;
      }
    });
  },
}};
</script>

<style scoped>
.boxes {
  display: flex;
  gap: 10px;
}
.box {
  width: 100px;
  height: 100px;
  border: 1px solid #000;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
.box.taken {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>
