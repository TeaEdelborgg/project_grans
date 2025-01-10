<template>
    <div id="bars" @mousedown="pressedDown" @touchstart="pressedDown"></div>
</template>

<script>
export default {
    props: {
        sent: Boolean,
        seeAlternatives: Boolean,
        questionActive: Boolean,
    },
    data() {
        return {
            placePressed: 0,
            pressed: false,
            sliderOffsetLeft: 0, // Håller reda på var slidern börjar
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
                        bar.style.top='-90%'; //0+'px'
                    }
                    else if (this.bottomPosition > this.maxBottom){
                        bar.style.bottom = '0';//;(this.maxPosition - (this.bottomPosition-this.topPosition))+'px'
                      }
                    else{
                        bar.style.top = -90+((this.currentPlace-this.placePressed)/this.heightPx)*100+'%';;// //-this.placePressed då vi vill ha den i sliderBox och inte på hela sidan
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

                if (this.bottomPosition >= this.maxBottom) {
                    bar.style.top='0'
                    bar.style.bottom='0'
                    //this.sent = true;
                    this.sendAnswer();
                } else {
                    // console.log("else")
                    bar.style.top = '-90%';
                }
            }
            
        },
        sendAnswer: function(e){
            this.$emit("sendAnswer")
            console.log("ska skicka svar från slidern");

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
                bar.style.top='-90%'
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
  background-size: cover;
  background-position: center;
  top:-90%;
  z-index: 2;
}
</style>
