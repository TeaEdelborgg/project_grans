<template>
    <section class="game-controls">
        <h2>{{ uiLabels.controlGame }}</h2>
        <button class="game-button" v-if="currentQuestion == -1" @click="runQuestion">
            {{ uiLabels.startGame }}
        </button>
        <button class="game-button" v-else-if="currentQuestion + 1 != questionAmount && canStartNextQuestion"
            @click="runQuestion">
            {{ uiLabels.nextQuestion }}
        </button>
        <button class="game-button finish-button" v-else-if="!canStartNextQuestion" @click="endQuestion">
            {{ uiLabels.finishQuestion }}
        </button>
        <button class="game-button" v-else-if="currentQuestion == currentQuestion" @click="finishGame">
            {{ uiLabels.ViewFinalResults }}
        </button>
        <div class="popup-background" v-if="showPopup">
            <EndingMessage v-bind:uiLabels="uiLabels"/>
        </div>
    </section>
</template>

<script>
import EndingMessage from './components/EndingMessage.vue';

export default {
    name: 'GameControls',
    components: {
        EndingMessage,
    },
    props: {
        uiLabels: Object,
        currentQuestion: Number,
        questionAmount: Number,
        canStartNextQuestion: Boolean,
    },
    data: function () {
        return {
            showPopup: false,
        }
    },
    emits: ["runQuestion", "endQuestion", "finishGame"],
    methods: {
        runQuestion: function () {
            this.$emit("runQuestion")
        },
        endQuestion: function () {
            this.$emit("endQuestion")
        },
        finishGame: function () {
            this.showPopup = true
            this.$emit("finishGame")
        }
    }
}
</script>