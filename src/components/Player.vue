<template>
  <div id="player">
    <Levelbox v-for="n in amountOfQuestions" v-bind:boxColor="player.information.color" v-bind:boxColorChange="player.information.coloredBoxes[n-1]" :id="n"></Levelbox>
  </div>
</template>

<script>
import Levelbox from './Levelbox.vue';

export default {
  name: 'Player',
  props: {
    player: Object,
    amountOfQuestions: Number
  },
  components:{
    Levelbox
  },
  data: function(){
    return{

    }
  },
  
}
</script>
<style>
#player{
  height: 100%;
  flex:1;
  max-width: 100%;
  margin-left: 5%;
  margin-right: 5%;
  display: flex;
  flex-direction: column-reverse;
  justify-content: space-evenly;
}

</style>