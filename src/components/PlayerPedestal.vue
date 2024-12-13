<template>
    <div id="playerpedestal" :style="{ '--pedestal-color': player.information.color }">
        {{player.information.name}} <br>
        {{ player.information.lives }} <br>
        {{ player.information.time }} <br>
    </div>
</template>

<script>
export default {
  name: 'PlayerPedestal',
  props: {
    player: Object
  },
  data: function(){
    return{
      
    }
  },
  //emits: ["answer"],
  methods: {
    //från player ska vi kalla på en funktion i resultat som sedan kallar på en funktion i data som tittar om svaren är korrekt.
  }
}
</script>

<style>
  #playerpedestal {
    color: white;
    background-color: var(--pedestal-color);
    padding: 10px;
    border-radius: 5px;
  }
</style>