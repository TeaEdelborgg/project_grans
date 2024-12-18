<template>
  <div id="boxes">
    <div id="containerBox">
      <Levelbox v-for="n in amountOfQuestions" :ref="'box-'+n" v-bind:boxColor="player.information.color" v-bind:borderColorChange="player.information.coloredBoxes[n-1]" v-bind:borderColor="color":id="n"></Levelbox>
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
      color:"gray",
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
.levelbox{
  flex: 1; 
  width: 80%;
  height:100%;
  margin:5px 0;
  margin-left:auto;
  margin-right: auto;
  background-color: gray;
  justify-content: center;
  align-items: center;
  display: flex;
  border-radius:10px;
  border-style:dashed;
}
</style>