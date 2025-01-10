<template>
  <div id="player">
    <div id="pile" :style="{
      background: 'linear-gradient(to right, '+player.information.color+' 0%, #c0c0c0 45% 55%, '+player.information.color+' 100%)', 
      height: calculateHeight(),
      filter: player.information.in==false ? 'brightness(50%)':'none'
      }">
    </div>
  </div>
</template>

<script>

export default {
  name: 'Player',
  props: {
    player: Object,
    amountOfQuestions: Number
  },
  components:{
    
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