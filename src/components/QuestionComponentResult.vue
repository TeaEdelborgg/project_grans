<template>
    <div id="backgroundFrame"></div>
    <!-- Ha class med margin auto?-->
        <div id="questionFrame">
            <div id="progressbar">
                <div id="progress"></div>
            </div>
            <p>{{question}}</p>
        </div>
</template>
    
<script>
    export default {
      name: 'QuestionComponentResult',
      emits:['timeUp'],
      props: {
        question: String,
        questionActive:Boolean
      },
      data: function(){
        return{
            timer:{
                time:10,
                interval:null
            },
          }
      },
      methods: {
        timerQuestionResult: function (){ //När denna startar ska en fråga popa up, sedan när tiden är över så ska den försvinna, ha component med fråga
        const progress = document.getElementById('progress');
        this.timer.time = 10;
        this.timer.interval = null;
        this.timer.interval = setInterval(()=>{
          if (this.timer.time>0){
            this.timer.time--;
            const percentage = (this.timer.time / 10) * 100
            progress.style.width=`${percentage}%`;
          } else{
            this.$emit('timeUp');
            clearInterval(this.timer.interval)
          }
        },1000);
        },
    
      },
      mounted (){
        if(this.$props.questionActive){
            this.timerQuestionResult();
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
  background-color: yellow;
}

</style>