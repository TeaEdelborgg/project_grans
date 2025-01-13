<template>
    <section class="end-game">
        <button class="game-button finish-button" @click="toggleEndGame">{{ uiLabels.finishEarly }}</button>
        <div class="popup-background" v-if="showEndGame" @click.self="toggleEndGame">
            <PopupEndGame :showEndGame="showEndGame" :uiLabels="uiLabels" @close="toggleEndGame" @end="finishGame" />
        </div>
    </section>
</template>

<script>
import PopupEndGame from './PopupEndGame.vue';

export default {
    name: 'EndGame',
    components: {
        PopupEndGame,
    },
    props: {
        uiLabels: Object,
    },
    data: function () {
        return {
            showEndGame: false,
        }
    },
    emits: ["finishGame"],
    methods: {
        toggleEndGame() {
            this.showEndGame = !this.showEndGame
        },
        finishGame() {
            this.$emit("finishGame")
        }
    }
}
</script>

<style scoped>
.end-game {
    position: absolute;
    bottom: 3vh;
    right: 2vw;
}
</style>