<template>
    <div id="slidercontainer">
        <SliderCompoment/>
    </div>
</template>

<script>
// @ is an alias to /src
import SliderCompoment from '@/components/SliderCompoment.vue';
import io from 'socket.io-client';
const socket = io("localhost:3000");

export default {
    name: 'FinalResultView',
    components: {
    SliderCompoment
    },
    data: function () {
        return {
        }
    },
    created: function () {
        //this.pollId = this.$route.params.id;
        socket.on( "uiLabels", labels => this.uiLabels = labels );
    },
}

</script>

<style>
    
#slidercontainer{
  background-color: greenyellow;
  width: 100%;
  height: 5%; 
}

</style>
