<template> 
      <div class="pedestal">
        <div id="circle" :style="{
          background: player.information.answers[questionNumber]!=null && questionActive ? 'lightyellow' : 'radial-gradient(circle at bottom, #8f8f8f, #4f4f4f', 
          boxShadow: player.information.answers[questionNumber]!=null && questionActive ? '0 0 10px rgba(255, 255, 255, 0.5), 0 0 20px rgba(255, 255, 255, 0.5), 0 0 30px rgba(255, 255, 255, 0.5), 0 0 40px rgba(255, 255, 255, 0.5)': 'none',
          borderColor: player.information.answers[questionNumber]!=null && questionActive ? 'lightyellow':'black'
          }"></div>
          <div class="playerpedestalTest" :style="{background: 'linear-gradient(to right, '+player.information.color+' 0%, #c0c0c0 45% 55%, '+player.information.color+' 100%)' }"> 
        <div id="nameBox" :style="{boxShadow: player.information.in ? '0 0 10px rgba(255, 255, 255, 0.5)': '0 0 0 0'}"> 
          <h3>{{player.information.name}} </h3>
        </div>
        <br>
        <div id="infoBox" :style="{boxShadow: player.information.in ? '0 0 10px rgba(255, 255, 255, 0.5)': '0 0 0 0'}"> 
          <div id="hjartan">
            <img :src="player.information.lives>=1 ? '/img/hjartaRod.png':'/img/hjartaGro.png'" class="hjarta">
            <img :src="player.information.lives>=2 ? '/img/hjartaRod.png':'/img/hjartaGro.png'" class="hjarta">
          </div>
          <br>
          <h1>{{ player.information.time }}s</h1>
        </div>
      </div>
      </div>
</template>

<script>
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
    height: 15%;
    width: 90%;
    background: linear-gradient(to right, #c2c2c2 0%, #e3e3e3 15%, #ffffff 30% 70%, #e3e3e3 85%,#c2c2c2 100%);
    color: black;
    text-align: center;
    border:10% solid;
    font-family:Georgia, 'Times New Roman', Times, serif;
    border-radius: 10%;
    margin-top:3%;
    position: relative;
  }
  #nameBox h3{
    position: absolute;
    left: 50%;
    color:black;
    top:50%;
    transform: translate(-50%,-50%);
    margin: auto;
  }
  #infoBox{
    height:70%;
    width: 90%;
    background: linear-gradient(to right, #c2c2c2 0%, #e3e3e3 15%, #ffffff 30% 70%, #e3e3e3 85%,#c2c2c2 100%);
    color:black;
    border-radius: 10%;
    text-align: center;
    font-family:Georgia, 'Times New Roman', Times, serif;
    font-size: larger;
    position: relative;
    margin:1%;
    margin-top:0;
  }
  #infoBox h1{
    position:absolute;
    bottom: 5%;
    text-align: center;
    width: 100%;
  }
  #circle{
    height:10%;
    width: 50%;
    margin: auto;
    border-radius: 50% 50% 0 0/100% 100% 0 0 ;
    position: relative;
    z-index:4;
  }
  .pedestal{
  flex:1;
  max-width: 12%;
  height:100%;
  margin:auto;
  position: relative;
  box-sizing: content-box;

}
  .playerpedestal {
    box-sizing: border-box;
    color: white;
    background-color: var(--pedestal-color);
    padding: 10px;
    border-radius: 5px;
    height:80%;
    width:10%;
    margin:auto;
    box-shadow: 5% 5% 10% rgb(0, 0, 0.3);
    z-index: 4;
    position:absolute;
    bottom: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .playerpedestalTest{
    position: absolute;
    box-shadow: 5% 5% 10% rgb(0, 0, 0.3);
    height: 100%;
    width: 100%;
    z-index:4;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
</style>