<template>
    <div id="bars" :class="{ verticalMove: seeAlternatives && !sent && selectedAnswer != null }"
        @mousedown="pressedDown" @touchstart="pressedDown">
    </div>
    <div id="arrow-container" v-if="selectedAnswer != null && !pressed && !sent && questionNumber == 0"
        :class="{ verticalMove: seeAlternatives }">
        <img id="arrow" src="/img/arrow.png" />
        <p id="arrow-text">{{ uiLabels.lockAnswer }}</p>
    </div>
</template>

<script>
export default {
    props: {
        sent: Boolean,
        seeAlternatives: Boolean,
        questionActive: Boolean,
        selectedAnswer: String,
        questionNumber: Number,
        uiLabels: Object,
    },
    data() {
        return {
            placePressed: 0,
            pressed: false,
            maxPosition: 0,
            minPosition: 0,
            heightPx: 0,
            topPosition: 0,
            bottomPosition: 0,
            currentPlace: 0,
            maxBottom: 0,
        };
    },
    emits: ["sendAnswer"],
    mounted() {
        let playerview = document.getElementById("player-view");
        const playerviewRect = playerview.getBoundingClientRect();
        this.heightPx = playerviewRect.bottom - playerviewRect.top;
        this.minPosition = '0%'
        this.maxPosition = '100%'
        this.maxBottom = playerviewRect.bottom
    },
    methods: {
        pressedDown: function (e) {
            if (!this.sent && this.seeAlternatives) {
                if (e.type == "touchstart") {
                    e.preventDefault();
                    this.placePressed = e.touches[0].clientY
                }
                else {
                    this.placePressed = e.clientY;
                }
                this.pressed = true;
                window.addEventListener("mousemove", this.move)
                window.addEventListener("mouseup", this.mouseReleased)
                window.addEventListener("touchmove", this.move)
                window.addEventListener("touchend", this.mouseReleased)
            }
        },
        move: function (e) {
            let bar = document.getElementById("bars")
            if (bar) {
                if (e.type == "touchmove") {
                    this.currentPlace = e.touches[0].clientY;
                }
                else {
                    this.currentPlace = e.clientY
                }
                const barRect = bar.getBoundingClientRect();
                this.topPosition = barRect.top;
                this.bottomPosition = barRect.bottom;

                if (this.pressed) {
                    let movedPlaced = this.currentPlace - this.placePressed
                    if (movedPlaced < 0) {
                        bar.style.top = '-85%';
                    }
                    else if (this.bottomPosition > this.maxBottom) {
                        bar.style.bottom = '0';
                    }
                    else { //-this.placePressed då vi vill ha den i sliderBox och inte på hela sidan
                        bar.style.top = -85 + ((this.currentPlace - this.placePressed) / this.heightPx) * 100 + '%';
                    }
                }
                else {
                    return 0
                }
            }
        },
        mouseReleased: function (e) {
            let bar = document.getElementById("bars")
            this.pressed = false;
            document.removeEventListener("mousemove", this.move)
            document.removeEventListener("mouseup", this.mouseReleased)
            document.removeEventListener("touchmove", this.move)
            document.removeEventListener("touchend", this.mouseReleased)
            if (bar) {
                if (this.bottomPosition >= this.maxBottom && this.selectedAnswer != null) {
                    bar.style.top = '0'
                    bar.style.bottom = '0'
                    this.sendAnswer();
                } else { // flyttar upp gallret om man inte skickar in svar
                    bar.style.top = '-85%';
                }
            }
        },
        sendAnswer: function (e) {
            if (!this.sent) {
                this.$emit("sendAnswer")
            }
        }
    },
    unmounted() {
        document.removeEventListener("mousemove", this.move)
        document.removeEventListener("mouseup", this.mouseReleased)
        document.removeEventListener("touchmove", this.move)
        document.removeEventListener("touchend", this.mouseReleased)
    },
    watch: { // flyttar upp gallret när frågan inte längre är aktiv
        questionActive(newValue) {
            let bar = document.getElementById("bars")
            if (newValue == false) {
                bar.style.top = '-85%'
                this.topPosition = '0'
                this.bottomPosition = '0'
            }
        }
    }
};
</script>

<style scoped>
#bars {
    position: absolute;
    width: 100%;
    height: 100%;
    background-image: url('/img/bars2.png');
    background-position: bottom;
    background-size: cover;
    top: -85%;
    z-index: 2;
}

#arrow-container {
    display: flex;
    flex-direction: column;
    z-index: 6;
    margin: auto;
    margin-top: 10vh;
}

#arrow {
    width: 10vw;
    margin: auto;
}

#arrow-text {
    font-size: 1em;
    font-weight: bold;
    margin-top: 1em;
    color: #c6c6c6;
}

.verticalMove {
    -webkit-animation: mover 0.75s infinite alternate;
    animation: mover 0.75s infinite alternate;
}

@keyframes mover {
    0% {
        transform: translateY(0);
    }

    100% {
        transform: translateY(-10px);
    }
}
</style>