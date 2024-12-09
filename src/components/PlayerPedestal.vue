<template>
    <div>
        {{player.information.name}}
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