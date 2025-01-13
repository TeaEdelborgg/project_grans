<template>
    <div id="upper-half">
        <div class="player-statistics">
            <div class="player-hearts">
                <img :src="this.userStats?.information?.lives >= 1 ? '/img/hjartaRod.png' : '/img/hjartaGro.png'"
                    class="heart">
                <img :src="this.userStats?.information?.lives >= 2 ? '/img/hjartaRod.png' : '/img/hjartaGro.png'"
                    class="heart">
            </div>
            <div class="player-time">{{ this.userStats?.information?.time }} s </div>
        </div>
        <div class="bar-rim"></div>
    </div>
</template>


<script>
export default {
    props: {
        userStats: Object,
    },
}
</script>

<style>
#upper-half {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #303030;
    /**linear-gradient(#101010, rgb(16, 16, 16, 0.95)) rgb(71, 71, 71)*/
    height: 15%;
    position: relative;
    top: 0;
    z-index: 3;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.8);
}

.player-statistics {
    display: flex;
    justify-content: center;
    align-items: center;
    padding-top: 2vh;
    padding-bottom: 2vh;
    background-color: #e3e3e3;
    border-radius: 10%/50%;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.8);
}

.player-hearts {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 5vw 0 5vw;
}

.heart {
    height: 2em;
    margin: 5%;
}

.player-time {
    font-size: 2em;
    font-weight: bold;
    color: #000000;
    margin: 0 5vw 0 5vw;
}
</style>