<template>
    <div id="sliderBox">
        <div id="slider" @mousedown="pressedDown" @touchstart="pressedDown">
            <p>Slide to lock</p>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            placePressed: 0,
            pressed: false,
            sliderOffsetLeft: 0, // Håller reda på var slidern börjar
            maxPosition: 0, // Maximal position för slidern
            minPosition: 0, // Minimal position för slidern
            leftPosition: 0, 
            rightPosition: 0,
            sent:false ,
            currentPlace:0,
        };
    },
    mounted() {
        // Beräkna räckvidden för slidern
        /*this.windowWidth = document.documentElement.clientWidth;
        this.minPosition = this.windowWidth*0.1;
        console.log('minposition: ',this.minPosition)
        this.maxPosition = this.windowWidth*0.9;
        console.log('maxposition: ',this.maxPosition)
        this.rightPosition = this.windowWidth*0.2;
        console.log('start right: ', this.rightPosition)*/
        let sliderBox = document.getElementById("sliderBox");

        const sliderBoxRect = sliderBox.getBoundingClientRect();
        this.minPosition = sliderBoxRect.left; // Vänstra gränsen
        this.maxPosition = sliderBoxRect.right; // Högra gränsen
        console.log('minPosition: ', this.minPosition, 'maxPosition: ', this.maxPosition);
    },
    methods: {
        pressedDown: function(e){
            if(!this.sent){
                //console.log(e.clientX)
                if(e.type=="touchstart"){
                    e.preventDefault();
                    this.placePressed = e.touches[0].clientX
                }
                else{
                    this.placePressed = e.clientX;
                }
                this.pressed = true;
                window.addEventListener("mousemove",this.move) //inte this.move() för då kallar den inte konstant
                window.addEventListener("mouseup", this.mouseReleased)
                window.addEventListener("touchmove",this.move)
                window.addEventListener("touchend", this.mouseReleased)
            }
        },
        move: function(e){
            let slider = document.getElementById("slider")
            if(slider){
                if(e.type =="touchmove"){
                this.currentPlace = e.touches[0].clientX;
                }
                else{
                    this.currentPlace = e.clientX
                }
                const sliderRect = slider.getBoundingClientRect();
                this.leftPosition = sliderRect.left;
                this.rightPosition = sliderRect.right;
                //console.log("gräns höger: ", this.rightPosition)

                if(this.pressed){
                    let movedPlaced = this.currentPlace-this.placePressed
                    if (movedPlaced < 0){
                        slider.style.left=0+'px';
                    }
                    else if (this.rightPosition > this.maxPosition){
                        slider.style.right = (this.maxPosition - (this.rightPosition-this.leftPosition))+'px';
                    }
                    else{
                        slider.style.left = (this.currentPlace-this.placePressed)+'px'; //-this.placePressed då vi vill ha den i sliderBox och inte på hela sidan
                    }    
                }
                else{
                    return 0
                }
            }  
        },
        mouseReleased: function(e){
            let slider = document.getElementById("slider")
            this.pressed = false;
            if(slider){
                console.log("mouse släppt")
                //fick massa fel när jag hade removeeventlistener här, och frågetecknen
                if (this.rightPosition >= this.maxPosition) {
                    slider.style.right = (this.maxPosition - (this.rightPosition-this.leftPosition))+'px';
                    this.sent = true;
                    this.sendAnswer(e);
                } else {
                    slider.style.left = 0+'px';
                }
            }
            document.removeEventListener("mousemove",this.move)
            document.removeEventListener("mouseup", this.mouseReleased)
            document.removeEventListener("touchmove",this.move)
            document.removeEventListener("touchend", this.mouseReleased)
        },
        //gör funktion som skriver hej, ska köras när den släpps på 100%
        //slidern ska också då fastna på 100% och man kan inte längre flytta den
        //annars ska den hamna på start igen
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
    }
};
</script>

<style scoped>
#sliderBox {
    width: 80vw;
    height: 5vh;
    margin: auto;
    background-color: #39A2DB;
    position: relative;
    border-radius: 0.5em;
}

#slider {
    width: 20%;
    height: 100%;
    background-color: orange;
    position: absolute;
    left: 0; /* Startar vid vänsterkanten */
    user-select: none;
    border-radius: 0.5em;
    display: flex;
}
#slider p {
    margin: auto;
    flex-direction: column;
}
</style>
