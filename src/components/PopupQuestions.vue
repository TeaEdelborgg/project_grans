<template>
    <div class="popup-questions-content">
        <button class="close-button" @click="close">x</button>
        <h3>{{ uiLabels.questionsAnswers }}</h3>
        <li v-for="(question, index) in questions" :key="index">
            <strong>{{ uiLabels.question + (index + 1) }}:</strong> {{ question.q }}<br>
            <strong>{{ uiLabels.correctAnswer }}</strong> {{ question.a.correct }}<br>
            <strong>{{ uiLabels.wrongAnswer }}</strong> {{ question.a.wrong.join(', ') }}<br><br>
        </li>
    </div>
</template>

<script>
export default {
    name: "PopupQuestions",
    props: {
        showQuestions: Boolean,
        questions: Object,
        uiLabels: Object,
    },
    methods: {
        close() {
            this.$emit("close");
        },
    },
};
</script>

<style scoped>
.popup-questions-content {
    position: relative;
    background: #0d1137;
    color: #c7c7c7;
    padding: 20px;
    border-radius: 10px;
    width: 50%;
    max-height: 80vh;
    overflow-y: auto;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
    list-style-type: none;
}

/* till scrollbar */
/* självaste scrollbaren */
.popup-questions-content::-webkit-scrollbar {
    width: 10px;
}

/* det som man drar i */
.popup-questions-content::-webkit-scrollbar-thumb {
    background: #2e2e2e;
    border-radius: 10px;
}

.popup-questions-content::-webkit-scrollbar-thumb:hover {
    background: #212121;
}

/* det som den ligger i */
.popup-questions-content::-webkit-scrollbar-track {
    background: #565656;
    border-radius: 10px;
}

.close-button {
    position: absolute;
    top: 10px;
    right: 10px;
    background: #fF6E00;
    color: #c7c7c7;
    border: none;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    font-size: 18px;
    font-weight: bold;
    cursor: pointer;
    text-align: center;
    line-height: 30px;
}

.close-button:hover {
    filter: brightness(75%)
}
</style>