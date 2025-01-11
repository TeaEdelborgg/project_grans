<template>
    <div id="nameBox" :style="{boxShadow: player.information.in ? '0 0 10px rgba(255, 255, 255, 0.5)': '0 0 0 0'}"> 
        <h3>{{player.information.name}} </h3>
    </div>
</template>
<script>
export default{
        name:'NameBox',
        props:{
            player:Object
        },
}
</script>
<style>
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
</style>