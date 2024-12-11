<template>
    <div id="backgroundFrame"></div>
    <!-- Ha class med margin auto?-->
        <div id="questionFrame">
            <p>Tid innan nästa fråga</p>
            {{ timeLeft }}
            <img src="/img/test.png" style="width:100px">
        </div>
</template>
    
<script>
    export default {
      name: 'QuestionComponentResult',
      emits:['timeUp'],
      props: {
        timeLeft:Number
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
