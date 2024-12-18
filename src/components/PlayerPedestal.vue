<template> <!--När jag lägger v-if här så blir pedestalen väldigt smal, får massa vue varningar ocskå-->
      <div class="playerpedestal" :style="{ '--pedestal-color': player.information.color }">
        {{player.information.name}} <br>
        <hr>
        {{uiLabels.livesLeft}}:{{ player.information.lives }} <br> <!--Byt ut mot hjärtan-->
        {{uiLabels.timeTotal}}:{{ player.information.time }} <br>
        <p v-if="player.information.answers.length==questionNumber+1 && questionActive">{{uiLabels.answered}}</p> 
      </div>
</template>

<script>
//när frågorna börjar så blir questionActive sann, när någon svarar så kallas en funktion som gör pedestalen gul
//när frågorna sedan är över görs questionActive till falsk och en metod körs som gör färgen på pedestalen till purple istället för gul
export default {
  name: 'PlayerPedestal',
  props: {
    player: Object,
    questionActive:Boolean,
    questionNumber:Number,
    uiLabels: Object
  },
  data: function(){
    return{
      //questionActive: false,
      playColor:'purple',
      answered:false,
    }
  },
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