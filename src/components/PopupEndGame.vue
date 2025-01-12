<template>
    <div class="popup-end-game-content">
        <p>{{ uiLabels.areYouSure }}</p>
        <button class="continue-button" @click="close">{{ uiLabels.continueGame }}</button>
        <button class="end-button" @click="end">{{ uiLabels.finishGame}}</button>
    </div>
</template>

<script>
export default {
    name: "PopupEndGame",
    props: {
        showEndGame: Boolean,
        questions: Object,
        uiLabels: Object,
    },
    methods: {
        close() {
            this.$emit("close");
        },
        end() {
            this.$emit("end")
        },
    },
};
</script>

<style scoped>
.popup-end-game-content {
    position: relative;
    background: #0d1137;
    color: #c7c7c7;
    padding: 20px;
    border-radius: 10px;
    width: 15%;
    max-height: 80vh;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
}

.continue-button {
    background: #4caf50;
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

.continue-button:hover {
    background: #408b44;
}

.end-button {
    background: #f44336;
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

.end-button:hover {
    background: #c62828;
}
</style>