<template>
    <div id="info-box" :style="{boxShadow: player.information.in ? '0 0 10px rgba(255, 255, 255, 0.5)': '0 0 0 0'}"> 
        <div id="hearts">
            <img :src="player.information.lives>=1 ? '/img/hjartaRod.png':'/img/hjartaGro.png'" class="heart">
            <img :src="player.information.lives>=2 ? '/img/hjartaRod.png':'/img/hjartaGro.png'" class="heart">
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
.heart{
  height: 90%;
  width: auto;
  margin-left: 10%;
  margin-top: 5%;
}
#hearts{
  height: 20%;
  width: 90%;
  display: flex;
  justify-content: center;
  justify-items: center;
}
  #info-box{
    height:70%;
    width: 90%;
    background: linear-gradient(to right, #c2c2c2 0%, #e3e3e3 15%, #ffffff 30% 70%, #e3e3e3 85%,#c2c2c2 100%);
    color:black;
    border-radius: 10%;
    text-align: center;
    font-family:Georgia, 'Times New Roman', Times, serif;
    font-size: larger;
    position: relative;
    margin:0 1% 1% 1%;
  }
  #info-box h1{
    position:absolute;
    bottom: 5%;
    text-align: center;
    width: 100%;
  }
</style>