<template>
    <div id="backgroundFrame"></div> 
    <!-- denna visas bara om countdown är aktiv-->
        <div id="questionFrame"> <!--container?-->
          <div v-if="questionActive">
            <div id="progressbar">
                <div id="progress" :style="{width:percentage+'%', animation: percentage<=50 ? 'shake 0.5s infinite':'none'}"></div>
            </div>
            <h1>{{question.q}}</h1>
            <br>
            <div id="rectangleContainer">
              <div v-for="(a,index) in question.a" class="testRect" :style="{
                borderLeft: index==0 ||index==2 ? '2px solid #7bb0f3':0,
                borderRight: index==1 || index==3? '2px solid #7bb0f3':0,
                borderBottom: index==2 || index==3 ? '2px solid #7bb0f3':0
                }">
                <div class="line"></div>
                <div class="rectangle">
                  <h3>{{ a }}</h3>
                </div> 
              </div>
            </div>  
          </div>
          <div v-if="!questionActive">
            <SpeakBubble v-bind:uiLabels="uiLabels" v-bind:timeLeftBeforeQuestion="timeLeftBeforeQuestion"></SpeakBubble>
          </div>
          <!--v-if inte aktiv-->
        </div>
</template>
    
<script>
import io from 'socket.io-client';
const socket = io(sessionStorage.getItem("dataServer")) 
import SpeakBubble from '@/components/SpeakBubble.vue';


    export default {
      name: 'QuestionComponentResult',
      emits:['countDownOverSend'],
      components:{
        SpeakBubble
      },
      props: {
        question: Object,
        uiLabels: Object
      },
      data: function(){
        return{
          pollId: "",
          questionActive:false,
          timeLeftBeforeQuestion:0,
          percentage:100,
          }
      },
      created: function (){
        this.pollId = this.$route.params.id;
        socket.emit( "joinPoll", this.pollId );
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
          let timeLeftTest;
          let endQuestion = false;

          let timerDuration = 13000;
          let timerAnswer = 10000;
          
          let interval = setInterval(() =>{
            let elapsedTime = Date.now() - startTime;
            if (!endQuestion) {
              timeLeftTest = timerDuration - elapsedTime;
            }
            socket.on('resetTime', () => {
              this.timeLeftTest = 0
              this.percentage = 0
              endQuestion = true
              // fattar ej varför detta behövs här? för i pollview funkar det utan så man hamnar i den sista else satsen automatiskt???
              console.log('kör clearInterval i socket')
              clearInterval(interval)
              this.$emit("countDownOverSend")
            })

            if (timeLeftTest > timerAnswer) {
              this.timeLeftBeforeQuestion = Math.floor((3000 - elapsedTime)/1000);
            } else if (timeLeftTest > 0) {
              this.questionActive = true;
              this.percentage = Math.floor(timeLeftTest / 100);
            } else {
              console.log('kör clearInterval orginal')
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
.rectangle{
  position: absolute;
  width: 80%;
  height: 40%;
  background: linear-gradient(#393a93, #7bb0f3, #393a93); 
  clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
  align-content: center;
  justify-content: center;
  top: 50%;  
  left: 50%; 
  transform: translate(-50%, -50%); 
  box-shadow: 0 0 5px #7bb0f3;
}
.testRect{
  flex:1;
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: center;
  position: relative;
}
.line{
  height: 2px;
  width: 100%;
  background-color: #7bb0f3;
  box-shadow: 0 0 5px #7bb0f3;
}
.rectangle h3{
  align-content: center;
  justify-content: center;
}

#rectangleContainer{
  margin-top:15%;
  width: 100%;
  height: 60%;
  display: grid;
  grid-template-columns: 45% 45%;
  grid-row: auto auto;
  justify-content: center;
  position:absolute;
  margin: auto;
  border-top:2px solid #7bb0f3;
  box-shadow: 0 0 5px #7bb0f3;
}
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
@keyframes shake {
  0%{
    transform: translateY(0);
  }
  50%{
    transform: translateY(-10%);
    background-color: red;
    box-shadow: 0 0 20px red;
    /**blinka rött */
  }
  100%{
    transform: translateY(0);
  }
}
</style>
