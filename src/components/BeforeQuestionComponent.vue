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
      methods: {
        
    
      },
      mounted (){
        /*if(this.$props.beforeQuestion){
            this.timerBeforeQUestion();
        }*/
        //jag vill att när v-show blir sann så ska jag här göra att funktionen för tiden körs
    },
    }
</script>
