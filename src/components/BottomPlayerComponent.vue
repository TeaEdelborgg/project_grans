<template>
    <div id="bottom-half">
        <div class="bar-rim" :style="{ top: '0' }"></div>
        <div class="help-buttons">
            <img src="/img/50-50.png" class="life-line" alt="50-50"
                :class="{ 'dimmed': userStats?.information?.usedFiftyFifty || !questionActive }"
                v-on:click="fiftyFifty" />
            <img src="/img/AskAudience.png" class="life-line" alt="AskAudience"
                :class="{ 'dimmed': userStats?.information?.usedAskAudience || !questionActive }"
                v-on:click="askAudience" />
        </div>
    </div>
</template>


<script>
export default {
    props: {
        userStats: Object,
        questionActive: Boolean,
    },
    emits: ["useAskAudience", "useFiftyFifty"],
    methods: {
        fiftyFifty: function () {
            this.$emit("useFiftyFifty")
        },
        askAudience: function () {
            this.$emit("useAskAudience")
        }
    }
}
</script>

<style>
#bottom-half {
    width: 100%;
    background: #303030;
    height: 20%;
    position: absolute;
    bottom: 0;
}

.help-buttons {
    display: flex;
    justify-content: center;
    align-items: center;
    transform: translateY(25%);
}

.life-line {
    height: 10vh;
    margin: 1vh 1vw 1vh 1vw;
    border: 5px solid #be8426;
    border-radius: 50%;
    box-shadow: 0 0 20px rgba(255, 255, 255, 0.8);
    cursor: pointer;
}

.life-line:hover {
    transform: scale(1.2);
    /* Ökar storleken när man hovrar */
}

.life-line.dimmed {
    filter: brightness(50%);
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.8);
}

.life-line.dimmed:hover {
    transform: scale(1);
    cursor: default;
}
</style>