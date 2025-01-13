<template>
    <div class="popup-end-game-content">
        <div v-if="!endGame">
            <p>{{ uiLabels.areYouSure }}</p>
            <button class="continue-button" @click="close">{{ uiLabels.continueGame }}</button>
            <button class="end-button" @click="end">{{ uiLabels.finishGame }}</button>
        </div>
        <EndingMessage v-bind:uiLabels="uiLabels" v-else/>
    </div>
</template>

<script>
import EndingMessage from './EndingMessage.vue';

export default {
    name: "PopupEndGame",
    components: {
        EndingMessage,
    },
    props: {
        showEndGame: Boolean,
        questions: Object,
        uiLabels: Object,
    },
    data() {
        return {
            endGame: false,
        }
    },
    methods: {
        close() {
            this.$emit("close");
        },
        end() {
            this.endGame = true
            this.$emit("end")
        },
    },
};
</script>

<style>
.popup-end-game-content {
    position: relative;
    background: #0d1137;
    color: #c7c7c7;
    padding: 20px;
    border-radius: 10px;
    width: 15%;
    max-height: 80vh;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
    margin: 1em;
    font-size: 1em;
    font-weight: bold;
}

.popup-end-game-content button {
    color: #ffffff;
    border-radius: 8px;
    border: none;
    padding: 0.5em 1em;
    margin: 0.5em;
    font-size: 1em;
    font-weight: bold;
    text-transform: uppercase;
    cursor: pointer;
}

.popup-end-game-content button:hover {
    transform: scale(1.1);
    filter: brightness(85%)
}

.continue-button {
    background: #4caf50;
}

.end-button {
    background: #f44336;
}
</style>