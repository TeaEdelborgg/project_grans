<template>
    <div id="bars" :class="{verticalMove: seeAlternatives && !sent && selectedAnswer != null }" @mousedown="pressedDown" @touchstart="pressedDown">
    </div>
    <div id="arrow-container" v-if="questionNumber==0 && selectedAnswer != null && !pressed && !sent" :class="{verticalMove: seeAlternatives }">
        <img id="arrow" src="/img/arrow.png"/>
        <p id="arrow-text">Lock<br>answer</p>
    </div>
</template>

<script>
export default {
    props: {
        sent: Boolean,
        seeAlternatives: Boolean,
        questionActive: Boolean,
        questionNumber: Number,
        selectedAnswer: String,
    },
    data() {
        return {
            placePressed: 0,
            pressed: false,
            maxPosition: 0, // Maximal position för slidern
            minPosition: 0, // Minimal position för slidern
            heightPx:0,
            topPosition: 0, 
            bottomPosition: 0,
            currentPlace:0,
            maxBottom:0,
        };
    },
    emits: ["sendAnswer"],
    mounted() {
        let playerview = document.getElementById("playerview");
        const playerviewRect = playerview.getBoundingClientRect();
        this.heightPx = playerviewRect.bottom-playerviewRect.top;
        this.minPosition='0%'
        this.maxPosition='100%'
        this.maxBottom = playerviewRect.bottom
    },
    methods: {
        pressedDown: function(e){
            //console.log("i pressedDown")
            if(!this.sent && this.seeAlternatives){
                //console.log(e.clientX)
                if(e.type=="touchstart"){
                    e.preventDefault();
                    this.placePressed = e.touches[0].clientY
                }
                else{
                    this.placePressed = e.clientY;
                }
                this.pressed = true;
                window.addEventListener("mousemove",this.move) //inte this.move() för då kallar den inte konstant
                window.addEventListener("mouseup", this.mouseReleased)
                window.addEventListener("touchmove",this.move)
                window.addEventListener("touchend", this.mouseReleased)
            }
        },
        move: function(e){
            // console.log("i move")
            let bar = document.getElementById("bars")
            if(bar){
                if(e.type =="touchmove"){
                    this.currentPlace = e.touches[0].clientY;
                }
                else{
                    // console.log("y pos: ", e.clientY)
                    this.currentPlace = e.clientY
                }
                const barRect = bar.getBoundingClientRect();
                this.topPosition = barRect.top;
                this.bottomPosition = barRect.bottom;
                // console.log("top: ", this.topPosition, " bottom: ", this.bottomPosition)

                if(this.pressed){
                    let movedPlaced = this.currentPlace-this.placePressed
                    if (movedPlaced < 0){
                        bar.style.top='-85%'; //0+'px'
                    }
                    else if (this.bottomPosition > this.maxBottom){
                        bar.style.bottom = '0';//;(this.maxPosition - (this.bottomPosition-this.topPosition))+'px'
                      }
                    else{
                        bar.style.top = -85+((this.currentPlace-this.placePressed)/this.heightPx)*100+'%';;// //-this.placePressed då vi vill ha den i sliderBox och inte på hela sidan
                    }    
                }
                else{
                    return 0
                }
            }  
        },
        mouseReleased: function(e){
          let bar = document.getElementById("bars")
          this.pressed = false;
          document.removeEventListener("mousemove",this.move)
            document.removeEventListener("mouseup", this.mouseReleased)
            document.removeEventListener("touchmove",this.move)
            document.removeEventListener("touchend", this.mouseReleased)
            if(bar){

                if (this.bottomPosition >= this.maxBottom && this.selectedAnswer != null) {
                    bar.style.top='0'
                    bar.style.bottom='0'
                    //this.sent = true;
                    this.sendAnswer();
                } else {
                    // console.log("else")
                    bar.style.top = '-85%';
                }
            }
        },
        sendAnswer: function(e){
            if (!this.sent) {
                this.$emit("sendAnswer")
                console.log("ska skicka svar från slidern");
            }
        }
    },
    unmounted(){
        document.removeEventListener("mousemove",this.move)
        document.removeEventListener("mouseup", this.mouseReleased)
        document.removeEventListener("touchmove",this.move)
        document.removeEventListener("touchend", this.mouseReleased)
    },
    watch:{
        questionActive(newValue){
            let bar = document.getElementById("bars")
            if(newValue==false){
                bar.style.top='-85%'
                this.topPosition='0'
                this.bottomPosition='0'
            }
        }
    }
};
</script>

<style scoped>
#bars{
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: url('/img/bars2.png');
  background-position: bottom;
  background-size: cover;
  top:-85%;
  z-index: 2;
}
#arrow-container {
  display: flex;
  flex-direction: column;
  z-index: 6;
  margin-left: auto;
  margin-right: 0.5em;
  margin-top: 10vh;
}
#arrow {
  width: 10vw;
  margin: auto;
}
#arrow-text {
    font-size: 1em;
    font-weight: bold;
    margin-top:0em;
    color: #c6c6c6;
}
.verticalMove {
    -webkit-animation: mover 0.75s infinite  alternate;
    animation: mover 0.75s infinite  alternate;
}
@keyframes mover {
    0% { transform: translateY(0); }
    100% { transform: translateY(-10px); }
}
</style>