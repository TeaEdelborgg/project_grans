<template>
    <div id="backgroundFrame"></div>
    <!-- Ha class med margin auto?-->
        <div id="questionFrame">
            <div id="progressbar">
                <div id="progress" :style="{width:progress+'%'}"></div>
            </div>
            <h1 :style="{color:'white'}">{{question}}</h1>
        </div>
</template>
    
<script>
    export default {
      name: 'QuestionComponentResult',
      emits:['timeUp'],
      props: {
        question: String,
        progress: Number,
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
}
#progressbar{
  width:100%;
  height:20px;
  background-color: lightgray;
  margin-left:auto;
  margin-right: auto;
}
#progress{
  width:100%;
  height:100%;
  background-color: #FF851B;
}
</style>
