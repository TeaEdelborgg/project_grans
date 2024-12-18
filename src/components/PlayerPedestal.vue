<template> <!--När jag lägger v-if här så blir pedestalen väldigt smal, får massa vue varningar ocskå-->
      <div class="playerpedestal" :style="{ '--pedestal-color': player.information.color }">
        {{player.information.name}} <br>
        <hr>
        {{uiLabels.livesLeft}}:{{ player.information.lives }} <br> <!--Byt ut mot hjärtan-->
        {{uiLabels.timeTotal}}:{{ player.information.time }} <br>
        <p v-if="answered==true">{{uiLabels.answered}}</p>
      </div>

    <!--<div v-if="questionActive==true">
      <div class="playerpedestal" :style="{'--pedestal-color': playColor}">
      {{player.information.name}} <br>
      {{ player.information.lives }} <br>
      {{ player.information.time }} <br>
    </div>
    </div>-->
    
</template>

<script>
//när frågorna börjar så blir questionActive sann, när någon svarar så kallas en funktion som gör pedestalen gul
//när frågorna sedan är över görs questionActive till falsk och en metod körs som gör färgen på pedestalen till purple istället för gul
export default {
  name: 'PlayerPedestal',
  props: {
    player: Object,
    questionActive:Boolean,
    uiLabels: Object
  },
  data: function(){
    return{
      //questionActive: false,
      playColor:'purple',
      answered:false,
    }
  },
  //emits: ["answer"],
  methods: {
    updateColor: function(val){
      console.log("uppdaterar färg")
      if(val){
        this.playColor='yellow'
        this.answered=true;
      }
      else{
        this.playColor='gray'
      }
    }
    //från player ska vi kalla på en funktion i resultat som sedan kallar på en funktion i data som tittar om svaren är korrekt.
  },
  watch:{
    questionActive(){ //kan möjligtvis göra det till en funktion istället, men måste hitta ett bra sätt att kalla på 
      //this.playColor=player.information.color
      this.answered=false
    }
  }

  //ha watch för när värdet på answered är sann
}
</script>

<style>
  .playerpedestal {
    color: white;
    background-color: var(--pedestal-color);
    padding: 10px;
    border-radius: 5px;
    height:60%;
    width:10%;
    margin:auto;
    border-style: solid;
    border-width:3px;
    border-color:black;
  }
</style>