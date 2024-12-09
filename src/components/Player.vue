<template>
    <div>
        namn: {{player.information.name}} svar: {{ player.information.answers }} corrected Answers: {{ player.information.correctedAnswers }}
    </div>
</template>

<script>
export default {
  name: 'Player',
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