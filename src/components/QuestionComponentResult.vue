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
      methods: {
        
    
      },
      mounted (){

        /*if(this.$props.questionActive){
            this.timerQuestionResult();
        }*/
        //jag vill att när v-show blir sann så ska jag här göra att funktionen för tiden körs
    },
    }
</script>
<style>
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
