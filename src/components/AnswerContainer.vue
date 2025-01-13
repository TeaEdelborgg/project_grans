<template>
    <div id="answers-container">
        <div v-for="(a, index) in answerAlternatives" class="container-button">
            <div class="line"></div>
            <div class="border-rectangle" :style="{ filter: isDisabled(a) ? 'brightness(30%)' : 'none' }">
                <button class="rectangle" :class="{
                    selected: a === selectedAnswer,
                    sended: a === selectedAnswer && sent,
                    showCorrect: a === selectedAnswer && showCorrectAnswer && isCorrectAnswer,
                    showIncorrect: a === selectedAnswer && showCorrectAnswer && !isCorrectAnswer,
                    showAudienceAnswer: a === audienceAnswer,
                }" v-on:click="selectAnswer(a)" v-bind:key="a" :disabled="isDisabled(a)">
                    <div class="text-container">
                        <span class="answer-letters"> {{ answerLetters[index] }}: </span>
                        <h3> {{ a }} </h3>
                    </div>
                </button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'AnswerContainer',
    props: {
        userId: String,
        quizId: String,
        uiLabels: Object,
        answerAlternatives: Array,
        sent: Boolean,
        showCorrectAnswer: Boolean,
        isCorrectAnswer: Boolean,
        audienceAnswer: String,
        fiftyFify: Array,
        questionActive: Boolean,
    },
    data: function () {
        return {
            answerLetters: ['A', 'B', 'C', 'D'],
            selectedAnswer: '',
        }
    },
    emits: ["answerSelected"],
    methods: {
        selectAnswer: function (answer) {
            this.selectedAnswer = answer;
            if (this.questionActive && !this.sent) {
                this.selectedAnswer = answer;
                this.$emit("answerSelected", this.selectedAnswer);
            }
        },
        isDisabled: function (a) {
            if (this.fiftyFify.length > 0) {
                for (let i = 0; i < 2; i++) {
                    if (a == this.fiftyFify[i]) {
                        return true;
                    }
                }
                return false;
            }
        },
    }
}
</script>

<style>
#answers-container {
    bottom: 0;
    width: 100%;
    height: 93%;
    display: grid;
    grid-template-columns: 50% 50%;
    grid-template-rows: 50% 50%;
    grid-row: auto auto;
    justify-content: center;
    position: absolute;
    margin: auto;
}

.container-button {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
}

.line {
    height: 2px;
    width: 100%;
    background-color: lightyellow;
    box-shadow: 0 0 5px lightyellow;
}

.border-rectangle {
    clip-path: polygon(15% 0%, 85% 0%, 100% 50%, 85% 100%, 15% 100%, 0% 50%);
    border: 2px solid lightyellow;
    position: absolute;
    width: 90%;
    height: 70%;
    background-color: lightyellow;
    box-shadow: 0 0 5px lightyellow;
}

.rectangle {
    width: 100%;
    height: 100%;
    background-color: #101c3e;
    color: #e3e3e3;
    clip-path: polygon(15% 0%, 85% 0%, 100% 50%, 85% 100%, 15% 100%, 0% 50%);
    position: relative;
    font-weight: bold;
}

.rectangle h3 {
    width: 75%;
    margin: 0;
    position: relative;
    font-size: 1.2em;
    overflow-wrap: break-word;
}

.text-container {
    position: absolute;
    width: 100%;
    display: flex;
    flex-direction: row;
    align-content: center;
    justify-content: center;
    text-align: center;
    align-items: center;
    transform: translateY(-50%);
}

.answer-letters {
    width: 5%;
    color: #FF851B;
    left: 0;
    position: relative;
    margin: 0;
    font-size: 1.2em;
    text-align: left;
}

.showAudienceAnswer {
    background-color: rgb(60, 69, 138);
    color: rgb(235, 235, 235);
}

.selected {
    background-color: #f9ac33;
    color: #e3e3e3;
}

.sended {
    background-color: #e07618;
    color: #e3e3e3;
}

.showCorrect {
    background-color: #56c763;
    color: #e3e3e3;
}

.showIncorrect {
    background-color: #fd4d47;
    color: #e3e3e3;
}
</style>