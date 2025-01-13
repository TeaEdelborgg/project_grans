<template>
    <div id="podium-container">
        <div v-for="n in 3" class="podium" :style="{ height: n == 2 ? '50%' : '30%' }">
            <h3 v-if="showNameWinners[n - 1] && winners[n - 1] != null" :style="{
                top: n == 2 ? '-13%' : '-23%'
            }">
                {{ winners[n - 1].information.name }}</h3>
            <h1 :style="{
                color: n == 1 ? '#C0C0C0' : n == 2 ? '#FFD700' : n == 3 ? '#cd7f32' : 'none',
                fontSize: n == 2 ? '6em' : '4em'
            }">
                {{ numberOrder[n - 1] }}</h1>
        </div>
        <div id="platform"></div>
        <div id="platform" :style="{
            zIndex: '-2',
            background: 'linear-gradient(to right, black, #858585, black)',
            bottom: '-15%',
            borderRadius: '25% 25% 50% 50%'
        }"></div>
    </div>
</template>
<script>
export default {
    name: 'Podium',
    props: {
        numberOrder: Array,
        showNameWinners: Array,
        winners: Array
    },
}
</script>
<style scoped>
#podium-container {
    height: 60%;
    width: 65%;
    position: relative;
    margin-top: 5%;
    display: grid;
    grid-template-columns: 20% 30% 20%;
    justify-content: center;
    text-align: center;
    align-items: end;
}

.podium {
    background: linear-gradient(to right, rgb(41, 41, 41) 0%, #be9611 20%, #ffd467 45% 55%, #be9611 80%, rgb(41, 41, 41) 100%);
    position: relative;
    margin-bottom: 0%;
    border-radius: 50%/10%;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
}

#podium-container h3 {
    color: #f9ac33;
    font-size: 1.5em;
    margin: 0;
    z-index: 5;
    position: relative;
    animation: showsText 0.5s;
    text-shadow: 0 1px 0 #4a4646, 0 2px 0 #4a4646, 0 0 2px #4a4646;

}

#podium-container h1 {
    color: white;
    margin: 0;
    z-index: 5;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    text-shadow: 0 1px 0 #4a4646, 0 3px 0 #4a4646, 0 0 2px #4a4646;
}

#platform {
    position: absolute;
    width: 100%;
    height: 20%;
    z-index: -1;
    background-color: #323232;
    bottom: -10%;
    border-radius: 50%;
}
</style>