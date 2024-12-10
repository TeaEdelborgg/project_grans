<template>
    <div id="backgroundFrame"></div>
    <!-- Ha class med margin auto?-->
        <div id="questionFrame">
            <p>Tid innan nästa fråga</p>
            {{ timerBefore.time }}
        </div>
</template>
    
<script>
    export default {
      name: 'QuestionComponentResult',
      emits:['timeUp'],
      props: {
        beforeQuestion:Boolean
      },
      data: function(){
        return{
            timerBefore: {
                time:3,
                interval:null
            },
          }
      },
      methods: {
        timerBeforeQUestion: function(){ //vill ha pop up där timern syns med en text, när tiden är 0 försvinner den, ha component med detta, mörklägg bakgrunden
        console.log("i timer innan fråga")
        this.timerBefore.time=3;
        this.timerBefore.interval=null;
        this.timerBefore.interval = setInterval(()=>{
          if (this.timerBefore.time>0){
            this.timerBefore.time--;
          } else {
            this.$emit('timeUp')
            clearInterval(this.timerBefore.interval)
          }
        },1000);
        }
    
      },
      mounted (){
        if(this.$props.beforeQuestion){
            this.timerBeforeQUestion();
        }
        //jag vill att när v-show blir sann så ska jag här göra att funktionen för tiden körs
    },
    }
</script>
<style>
#questionFrame{
    height: 400px;
    width: 80%;
    margin:auto;
    background-color: white;
    position: absolute;
    z-index: 3;
}
#backgroundFrame{
    height: 100%;
    width: 100%;
    opacity: 0.5;
    position: absolute;
    z-index: 2;
    background-color: black;
}
#windowContainer{
    height: 100%;
    width: 100%;
    position: relative;
}

</style>