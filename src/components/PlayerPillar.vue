<template>
  <div id="player">
    <div id="pile" :style="{
      background: 'linear-gradient(to right, '+player.information.color+' 0%, #c0c0c0 45% 55%, '+player.information.color+' 100%)', 
      height: player.information.pillarHeight+'%',
      filter: player.information.in==false ? 'brightness(50%)':'none'
      }">
    </div>
  </div>
</template>

<script>

export default {
  name: 'PlayerPillar',
  props: {
    player: Object,
    amountOfQuestions: Number
  },
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