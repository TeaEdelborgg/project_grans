<template>
    <div id="background">
        <div v-if="showNameWinners[1]" id="confetti">
        </div>
        <div id="score-board-container" v-if="winners.length > 0">
            <HeadLight v-bind:direction="'left'"></HeadLight>
            <HeadLight v-bind:direction="'right'"></HeadLight>
            <Podium v-bind:numberOrder="numberOrder" v-bind:showNameWinners="showNameWinners" v-bind:winners="winners">
            </Podium>
            <div id="loser-container">
                <p v-for="(player, index) in losers" v-if="showNameLosers"> <span>{{ index + 4 }}.</span> {{
                    player.information.name }}</p> <br>
            </div>
        </div>
    </div>
</template>

<script>
import io from 'socket.io-client';
import Podium from '../components/Podium.vue';
import HeadLight from '../components/HeadLight.vue';
//const socket = io("localhost:3000");
const socket = io(sessionStorage.getItem("dataServer"))

export default {
    name: 'ResultView',
    components: {
        Podium,
        HeadLight
    },
    data: function () {
        return {
            uiLabels: {},
            pollId: "",
            winners: [],
            losers: [],
            showNameLosers: false,
            showNameWinners: [],
            totalWinners: 0,
            showingOrderAlternativs: { 1: [1], 2: [0, 1], 3: [2, 0, 1] },
            showingOrder: [],
            numberOrder: [2, 1, 3]
        }
    },
    created: function () {
        this.pollId = this.$route.params.id
        socket.on("sendScoreBoard", val => {
            console.log("val: ", val)
            this.winners = val.slice(0, 3)
            this.showNameWinners = new Array(this.winners.length).fill(false)

            let temp = this.winners[0]
            this.winners[0] = this.winners[1]
            this.winners[1] = temp

            this.losers = val.slice(3, val.length)
            this.showNames()
        })
        socket.on("uiLabels", labels => this.uiLabels = labels);
        socket.emit("joinPoll", this.pollId);
        socket.emit("getUILabels", this.lang);
    },
    mounted() {
        socket.emit('getScoreBoard', this.pollId)
    },
    methods: {
        showNames: function () {
            this.totalWinners = this.winners.filter(item => item != null).length
            this.showingOrder = this.showingOrderAlternativs[this.totalWinners]

            for (let i = 0; i < this.showingOrder.length; i++) {
                console.log('i: ', i, 'plats: ', this.showingOrder[i])
                let time = (i + 1) * 2000
                let index = this.showingOrder[i]
                this.showNamesCountDown(index, time)
            }

            this.showNamesCountDown(4, (this.totalWinners + 1) * 2000)
        },
        showNamesCountDown: function (index, time) {
            setTimeout(() => {
                console.log("tid uppe")
                if (index <= this.totalWinners) {
                    this.showNameWinners[index] = true
                }
                else {
                    this.showNameLosers = true;
                }
            }, time)
        }
    }
}

</script>

<style>
#background {
    width: 100vw;
    height: 100vh;
    background-color: #001F3F;
    background: linear-gradient(135deg, #0a0347, #3c298f);
    position: fixed;
}

#confetti {
    position: absolute;
    z-index: 0;
    height: 100%;
    width: 100%;
    animation: fallingconfetti 5s ease-out;
    overflow: hidden;
    opacity: 0;
    background-image: url('/img/confetti2.png');
    background-size: 30%;
    background-repeat: repeat;
}

#confetti img {
    width: 100%;
    height: auto;
    object-fit: contain;
}

@keyframes fallingconfetti {
    0% {
        transform: translateY(-200%);
        opacity: 1;
    }

    90% {
        opacity: 1;
    }

    100% {
        transform: translateY(200%);
        opacity: 0;
    }
}

#score-board-container {
    height: 100%;
    width: 80%;
    margin: auto;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    flex-grow: 1;
    position: relative;
    z-index: 2;
}

#loser-container {
    flex: 1;
    width: 40%;
    margin-top: 7%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 2;
}

#loser-container p {
    color: #FF851B;
    box-shadow: 0 0 20px lightyellow;
    height: 20%;
    width: 100%;
    margin: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    z-index: 2;
    animation: showsText 1s;
}

#losercontainer span {
    position: absolute;
    left: 5%;
}

@keyframes showsText {
    0% {
        opacity: 0;
    }

    100% {
        opacity: 1;
    }
}
</style>
