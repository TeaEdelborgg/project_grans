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
            <h1>{{uiLabels.readyBeforeQuestion}}</h1> <!--alla color borde kunna finnas under questionframe-->
            <h2>
              {{ timeLeftBeforeQuestion }}
            </h2>
          </div>
          <!--v-if inte aktiv-->
        </div>
</template>
    
<script>
    export default {
      name: 'QuestionComponentResult',
      emits:['countDownOver'],
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
        this.countdownResult()
      },
      methods:{
        //ha countdown här, när den är färdig skickas metod till vanliga som skickar socket.emit + gör denna osynlig
        countdownResult: function(){
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
              this.$emit("countDownOver")
            }
          }, 100);  
        },
      }
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
#questionFrame h1,h2{
  color:white;
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
