<template>
    <div class="participants">
        <div class="one-participant" v-for="(participant, index) in pollData?.participants" :key="index">
            <p class="player-name">{{ participant.information.name }}</p>
            <hr>
            <div v-if="pollData.currentQuestion == -1">Answer</div>
            <div v-else-if="participant.information.answers?.[pollData.currentQuestion]?.[0] == null">
                <div class="loading-dots">
                    <div class="animatedDots"></div>
                    <div class="animatedDots"></div>
                    <div class="animatedDots"></div>
                </div>
            </div>
            <div v-else>
                {{ participant.information.answers[pollData.currentQuestion][0] || "Har inte svarat ännu" }}
            </div>
        </div>
    </div>

</template>

<script>
export default {
    name: "PlayersAdmin",
    props: {
        pollData: Object,
    },
};
</script>

<style scoped>
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
}

.player-name {
    font-size: 1.2em;
    font-weight: bold;
    color: #cfcfcf;
    margin-bottom: 0.5em;
    margin-top: 0;
}

/* animering av prickar nedan */
.animatedDots {
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

.animatedDots:nth-child(0) {
    animation-delay: 0s;
}

.animatedDots:nth-child(1) {
    animation-delay: 0.2s;
}

.animatedDots:nth-child(2) {
    animation-delay: 0.4s;
}

.animatedDots:nth-child(3) {
    animation-delay: 0.6s;
}
</style>