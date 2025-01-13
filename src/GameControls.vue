<template>
    <section class="game-controls">
        <h2>{{ uiLabels.controlGame }}</h2>
        <button class="game-button" v-if="currentQuestion == -1" @click="runQuestion">
            {{ uiLabels.startGame }}
        </button>
        <button class="game-button"
            v-else-if="currentQuestion + 1 != questionAmount && canStartNextQuestion"
            @click="runQuestion">
            {{ uiLabels.nextQuestion }}
        </button>
        <button class="game-button finish-button" v-else-if="!canStartNextQuestion" @click="endQuestion">
            {{ uiLabels.finishQuestion }}
        </button>
        <button class="game-button" v-else @click="finishGame">
            {{ uiLabels.ViewFinalResults }}
        </button>
    </section>
</template>

<script>
export default {
    name: 'GameControles',
    props: {
        uiLabels: Object,
        currentQuestion: Number,
        questionAmount: Number,
        canStartNextQuestion: Boolean,
    },
    data: function () {
        return {
            one: 1,
        }
    },
    emits: ["runQuestion", "endQuestion"],
    methods: {
        runQuestion: function() {
            this.$emit("runQuestion")
        },
        endQuestion: function() {
            this.$emit("endQuestion")
        }
    }
}
</script>