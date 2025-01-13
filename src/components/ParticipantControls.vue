<template>
    <section class="participant-controls">
        <h2>{{ uiLabels.players }}</h2>
        <div class="participants">
            <div class="one-participant" v-for="(participant, index) in quizData?.participants" :key="index">
                <p class="player-name">{{ participant.information.name }}</p>
                <hr>
                <div v-if="quizData.currentQuestion == -1">{{ uiLabels.answer }}</div>
                <div v-else-if="participant.information.answers?.[quizData.currentQuestion]?.[0] == null">
                    <div class="loading-dots">
                        <div class="animated-dots"></div>
                        <div class="animated-dots"></div>
                        <div class="animated-dots"></div>
                    </div>
                </div>
                <div v-else>
                    {{ participant.information.answers[quizData.currentQuestion][0] }}
                </div>
            </div>
        </div>
    </section>
</template>

<script>
export default {
    name: "PlayersAdmin",
    props: {
        quizData: Object,
        uiLabels: Object,
    },
};
</script>

<style>
.participant-controls {
    max-width: 50%;
    margin-inline: auto;
}

.participants {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
}

.one-participant {
    background: #0c0f38;
    padding: 1.5em;
    margin: 0.5em;
    border-radius: 10px;
    color: #cfcfcf;
    text-align: center;
    width: 10vw;
    min-height: 13vh;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
}

.player-name {
    font-size: 1.2em;
    font-weight: bold;
    color: #cfcfcf;
    margin-bottom: 0.5em;
    margin-top: 0;
}

/* animering av prickar nedan */
.animated-dots {
    height: 0.3rem;
    width: 0.3rem;
    border-radius: 50%;
    animation: dotsAnimation 2s ease-in-out infinite;
    display: inline-block;
    margin: .1rem;
}

@keyframes dotsAnimation {

    0%,
    100% {
        transform: scale(0.2);
        background-color: #e4e4e4;
    }

    40% {
        transform: scale(1);
        background-color: #7a7a7a;
    }

    50% {
        transform: scale(1);
        background-color: #484848;
    }
}

.animated-dots:nth-child(0) {
    animation-delay: 0s;
}

.animated-dots:nth-child(1) {
    animation-delay: 0.2s;
}

.animated-dots:nth-child(2) {
    animation-delay: 0.4s;
}

.animated-dots:nth-child(3) {
    animation-delay: 0.6s;
}
</style>