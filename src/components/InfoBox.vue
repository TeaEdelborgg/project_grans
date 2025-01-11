<template>
    <div id="infoBox" :style="{boxShadow: player.information.in ? '0 0 10px rgba(255, 255, 255, 0.5)': '0 0 0 0'}"> 
        <div id="hjartan">
            <img :src="player.information.lives>=1 ? '/img/hjartaRod.png':'/img/hjartaGro.png'" class="hjarta">
            <img :src="player.information.lives>=2 ? '/img/hjartaRod.png':'/img/hjartaGro.png'" class="hjarta">
        </div>
        <br>
        <h1><span :style="{fontSize:'1.5em'}">{{ player.information.time }}</span>s</h1>
    </div>
</template>
<script>
export default{
        name:'InfoBox',
        props:{
            player:Object
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
</style>