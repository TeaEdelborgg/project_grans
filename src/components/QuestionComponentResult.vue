<template>
    <div id="backgroundFrame"></div> 
    <!-- denna visas bara om countdown är aktiv-->
        <div id="questionFrame"> <!--container?-->
          <div v-if="questionActive">
            <div id="progressbar">
                <div id="progress" :style="{width:percentage+'%'}"></div>
            </div>
            <h1>{{question}}</h1>
          </div>
          <div v-if="!questionActive">
            <SpeakBubble v-bind:uiLabels="uiLabels" v-bind:timeLeftBeforeQuestion="timeLeftBeforeQuestion"></SpeakBubble>
          </div>
          <!--v-if inte aktiv-->
        </div>
</template>
    
<script>
import SpeakBubble from '@/components/SpeakBubble.vue';


    export default {
      name: 'QuestionComponentResult',
      emits:['countDownOverSend'],
      components:{
        SpeakBubble
      },
      props: {
        question: String,
        uiLabels: Object
      },
      data: function(){
        return{
          questionActive:false,
          timeLeftBeforeQuestion:0,
          percentage:100,
          }
      },
      mounted(){
        console.log("fråga borde visas i mounted")
        this.countdownResult()
      },
      methods:{
        //ha countdown här, när den är färdig skickas metod till vanliga som skickar socket.emit + gör denna osynlig
        countdownResult: function(){
          console.log("fråga borde visas")
          let startTime = Date.now();

          let timerDuration = 13000;
          let timerAnswer = 10000;
          
          let interval = setInterval(() =>{
            let elapsedTime = Date.now() - startTime;
            let timeLeftTest = timerDuration - elapsedTime;

            if (timeLeftTest > timerAnswer) {
              this.timeLeftBeforeQuestion = Math.floor((3000 - elapsedTime)/1000);
            } else if (timeLeftTest > 0) {
              this.questionActive = true;
              this.percentage = Math.floor(timeLeftTest / 100);
            } else {
              clearInterval(interval)
              //skicka till resultatview att köra funktionen
              this.$emit("countDownOverSend")
            }
          }, 100);  
        },
      }
    }
</script>
<style>
#backgroundFrame{
  position:fixed;
  opacity: 0.5;
  background-color: black;
  top:0;
  left:0;
  z-index: 2;
  height:100%;
  width: 100%;
}
#questionFrame{
  width: 100%;
  height: 100%;
  margin: auto;
  z-index: 3;
  /*left:50%;
  top:40%;*/
  /*transform: translate(-50%,-50%);*/
  background-color: #001F3F;
  position: absolute;
}
#questionFrame h1,h2{
  color:White;
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
