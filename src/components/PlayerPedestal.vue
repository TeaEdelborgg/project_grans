<template> 
      <div class="pedestal-container">
        <HalfCircle v-bind:lightPedestal="lightPedestal" v-bind:questionActive="questionActive"></HalfCircle>
        <div class="pedestal" :style="{background: 'linear-gradient(to right, '+player.information.color+' 0%, #c0c0c0 45% 55%, '+player.information.color+' 100%)' }"> 
          <NameBox v-bind:player="player"></NameBox>
          <br>
          <InfoBox v-bind:player="player"></InfoBox>
        </div>
      </div>
</template>

<script>
import HalfCircle from './HalfCircle.vue';
import InfoBox from './InfoBox.vue';
import NameBox from './NameBox.vue';

export default {
  name: 'PlayerPedestal',
  props: {
    player: Object,
    questionActive:Boolean,
    questionNumber:Number,
    uiLabels: Object,
    lightPedestal: Boolean
  },
  components:{
    InfoBox,
    NameBox,
    HalfCircle
  },
}
</script>

<style>
  .pedestal-container{
  flex:1;
  max-width: 12%;
  height:100%;
  margin:auto;
  position: relative;
}
  .pedestal{
    position: absolute;
    box-shadow: 5% 5% 10% rgb(0, 0, 0.3);
    height: 100%;
    width: 100%;
    z-index:4;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
</style>