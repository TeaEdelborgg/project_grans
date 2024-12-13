<template>
    <div id="sliderBox">
        <div 
            ref="slider" 
            id="slider" 
            @mousedown="pressedDown"
        >
            hejsan
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            placePressedX: 0,
            pressed: false,
            sliderOffsetLeft: 0, // Håller reda på var slidern börjar
            maxPosition: 0, // Maximal position för slidern
            minPosition: 0, // Minimal position för slidern
        };
    },
    mounted() {
        // Beräkna räckvidden för slidern
        const sliderBox = this.$refs.slider.parentNode;
        const slider = this.$refs.slider;
        this.minPosition = 0;
        this.maxPosition = sliderBox.offsetWidth - slider.offsetWidth;
    },
    methods: {
        pressedDown(e) {
            this.pressed = true;
            this.placePressedX = e.clientX;
            this.sliderOffsetLeft = this.$refs.slider.offsetLeft;
            window.addEventListener("mousemove", this.elementDrag);
            window.addEventListener("mouseup", this.closeDragElement);
        },
        elementDrag(e) {
            if (!this.pressed) return;
            // Räkna ut hur mycket musen har rört sig
            const deltaX = e.clientX - this.placePressedX;
            let newLeft = this.sliderOffsetLeft + deltaX;

            // Begränsa rörelsen inom minPosition och maxPosition
            newLeft = Math.max(this.minPosition, Math.min(newLeft, this.maxPosition));

            // Uppdatera sliderns position
            this.$refs.slider.style.left = newLeft + "px";
        },
        closeDragElement() {
            this.pressed = false;
            window.removeEventListener("mousemove", this.elementDrag);
            window.removeEventListener("mouseup", this.closeDragElement);
        },
    },
};
</script>

<style scoped>
#sliderBox {
    width: 80%;
    height: 100px;
    margin: auto;
    background-color: aqua;
    position: relative;
}

#slider {
    width: 15%;
    height: 100%;
    background-color: orange;
    position: absolute;
    left: 0; /* Startar vid vänsterkanten */
}
</style>
