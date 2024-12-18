<template>
  <div id="boxes">
    <div id="containerBox">
      <Levelbox v-for="n in amountOfQuestions" v-bind:boxColor="player.information.color" v-bind:boxColorChange="player.information.coloredBoxes[n-1]" :id="n"></Levelbox>
    </div>
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
#containerBox{
  width: 100%;
  display: flex;
  flex-direction: column-reverse;
  justify-content: space-evenly;
  height: 100%;
  margin:auto
}
#boxes{
  width:100%;
  display: flex;
  justify-content: space-evenly;
  height:100%;
  margin: auto;
}

</style>