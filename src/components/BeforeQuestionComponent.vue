<template>
    <div id="backgroundFrame"></div>
    <!-- Ha class med margin auto?-->
        <div id="questionFrame">
            <h1 :style="{color:'white'}">{{uiLabels.readyBeforeQuestion}}</h1>
            <h2 :style="{color:'white'}">
              {{ timeLeft }}
            </h2>
            <img src="/img/test.png" style="width:100px">
        </div>
</template>
    
<script>
    export default {
      name: 'QuestionComponentResult',
      emits:['timeUp'],
      props: {
        timeLeft:Number,
        uiLabels: Object
      },
      data: function(){
        return{
          }
      },
    }
</script>
<style>
#backgroundFrame{
  position:absolute;
  opacity: 0.5;
  background-color: black;
  z-index: 10;
  height:75%;
  width: 100%;
}
#questionFrame{
  width: 85%;
  height: 65%;
  margin: auto;
  left:50%;
  top:40%;
  transform: translate(-50%,-50%);
  z-index: 11;
  background-color: #001F3F;
  position: absolute;
}</style>