<template>
    <section class="game-status">
        <h2>{{ uiLabels.gameStatus }}</h2>
        <div>
            <p>{{ uiLabels.numberOfAnswers + numberPlayersAnswered }}/{{ numberPlayers }}</p>
            <p>{{ uiLabels.currentQuestion + (currentQuestion + 1) }}/{{ questionAmount }}</p>
        </div>
        <div class="questions"> <!-- onödig div? har inget som formaterar detta -->
            <button class="game-button" @click="toggleQuestions">{{ uiLabels.viewQuestionsAnswers }}</button>
            <div class="popup-background" v-if="showQuestions" @click.self="toggleQuestions">
                <PopupQuestions :showQuestions="showQuestions" :questions="questions" :uiLabels="uiLabels"
                    @close="toggleQuestions" />
            </div>
        </div>
    </section>
</template>

<script>
import PopupQuestions from './PopupQuestions.vue';

export default {
    name: 'GameStatus',
    components: {
        PopupQuestions
    },
    props: {
        uiLabels: Object,
        numberPlayers: Number,
        numberPlayersAnswered: Number,
        currentQuestion: Number,
        questionAmount: Number,
        questions: Object,
    },
    data: function () {
        return {
            showQuestions: false,
        }
    },
    methods: {
        toggleQuestions() {
            this.showQuestions = !this.showQuestions;
        },
    }
}
</script>

<style>
.game-status {
    position: absolute;
    top: 20vh;
    left: 3vw;
    background: #4c3100;
    padding: 10px;
    color: #c7c7c7;
    border-radius: 5px;
}
</style>