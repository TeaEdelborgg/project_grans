<template>
  <div id="player">
    <!--<Levelbox v-for="n in amountOfQuestions" v-bind:boxColor="player.information.color" v-bind:boxColorChange="player.information.coloredBoxes[n-1]" :id="n"></Levelbox>-->
    <div id="pile" :style="{
      background: 'linear-gradient(to right, '+player.information.color+', #c0c0c0, '+player.information.color+')', 
      height: calculateHeight(),
      filter: player.information.in==false ? 'brightness(50%)':'none'
      }">
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
      heightSteps:0
    }
  },
  methods:{
    calculateHeight: function(){
      const amountOfCorrect = this.player.information.coloredBoxes.filter(value => value===true).length;
      if(amountOfCorrect==0){
        return 2+'%';
      }
      return this.heightSteps*amountOfCorrect+'%';
    }
  },
  mounted(){
    this.heightSteps = 100/this.amountOfQuestions;
  }
  
}
</script>
<style>
#pile{
  width: 90%;
  height: 2%;
  position:absolute;
  bottom: 0;
  border-radius: 5% 5% 0 0;
  transition: height 2s ease-out;
  border-bottom: none;
}
#player{
  height: 100%;
  flex:1;
  max-width: 85%;
  display: flex;
  flex-direction: column-reverse;
  justify-content: space-evenly;
  position: relative;
}

</style>