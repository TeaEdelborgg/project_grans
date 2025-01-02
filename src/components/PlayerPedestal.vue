<template> <!--När jag lägger v-if här så blir pedestalen väldigt smal, får massa vue varningar ocskå-->
      <div id="circle" :style="{backgroundColor: player.information.answers[questionNumber]!=null && questionActive ? 'yellow' : 'gray'}"></div>
      <div class="playerpedestal" :style="{ '--pedestal-color': player.information.color }">
        <div id="nameBox">
          {{player.information.name}} 
        </div>
        <br>
        <div id="infoBox" :style="{borderColor: player.information.in ? 'yellow' : 'gray', boxShadow: player.information.in ? '0 0 10px rgba(255, 255, 255, 0.5), 0 0 20px rgba(255, 255, 255, 0.5), 0 0 30px rgba(255, 255, 255, 0.5), 0 0 40px rgba(255, 255, 255, 0.5)': '0 0 0 0'}">
          <!--{{uiLabels.livesLeft}}:{{ player.information.lives }} <br> Byt ut mot hjärtan-->
          <div id="hjartan">
            <img :src="player.information.lives>=1 ? '/img/hjartaRod.png':'/img/hjartaGro.png'" class="hjarta">
            <img :src="player.information.lives>=2 ? '/img/hjartaRod.png':'/img/hjartaGro.png'" class="hjarta">
          </div>
          <br>
          <!--{{uiLabels.timeTotal}}:{{ player.information.time }} <br>-->
          <h1>{{ player.information.time }}</h1>
        </div>
        <!--<p v-if="player.information.answers[questionNumber]!=null && questionActive">{{uiLabels.answered}}</p> -->
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
.hjarta{
  height: 90%;
  width: auto;
  margin-left: 10%;
  margin-top: 5%;
}
#hjartan{
  height: 20%;
  width: 90%;
  display: flex;
  justify-content: center;
  justify-items: center;
}
  #nameBox{
    height: 20%;
    width: 90%;
    background-color: white;
    color: black;
    text-align: center;
    font-family:Georgia, 'Times New Roman', Times, serif;
    border-radius: 10%;
  }
  #infoBox{
    height:70%;
    width: 90%;
    background-color: white;
    color:black;
    border-radius: 10%;
    border-style: solid;
    text-align: center;
    font-family:Georgia, 'Times New Roman', Times, serif;
    font-size: larger;
    border-width: 100%;
    position: relative;
  }
  #infoBox h1{
    position:absolute;
    bottom: 3%;
    text-align: center;
    width: 100%;
  }
  #circle{
    height:40%;
    width: 5%;
    background-color: gray;
    border-radius: 50%;
    z-index:4;
    border-color: black;
    border-style: solid;
  }
  .playerpedestal {
    color: white;
    background-color: var(--pedestal-color);
    padding: 10px;
    border-radius: 5px;
    height:80%;
    width:10%;
    margin:auto;
    border-left: 3px solid black;
    border-right: 3px solid black;
    border-top: 3px solid black;
    box-shadow: 5% 5% 10% rgb(0, 0, 0.3);
    z-index: 4;
    position:absolute;
    bottom: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
</style>