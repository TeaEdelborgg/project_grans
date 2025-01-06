<template>
    <div id="backgroundFrame"></div> 
    <!-- denna visas bara om countdown är aktiv-->
        <div id="questionFrame"> <!--container?-->
          <div>
            <div id="progressbar">
                <div id="progress" :style="{width:percentage+'%', animation: percentage<=30 ? 'shake 0.5s infinite':'none'}"></div>
            </div>
            <div v-if="showQuestion" id="question">
              <div class="line"></div>
              <div class="borderRect" :style="{width:'30%', height:'30%', top:'0'}">
                <div class="rectangle" :style="{background: 'radial-gradient(#ffd467, #be9611)'}"><p>{{currentValue}}</p></div>
              </div>
              <h1>{{question.q}}</h1>
              <div class="line"></div>
            </div>
            <br>
            <div v-if="questionActive" id="rectangleContainer">
              <div v-for="(a,index) in question.a" class="testRect" id="a">
                <div class="line"></div>
                <div class="borderRect">
                  <div class="rectangle" :style="{backgroundColor: a==correctAnswer && showCorrectAnswer ? '#FF851B':'none'}">
                    <h3 :style="{color: a==correctAnswer && showCorrectAnswer ? 'black':'none'}"><span :style="{color: a==correctAnswer && showCorrectAnswer ? 'black':'none'}">{{questionLetters[index]}}: </span>{{ a }}</h3>
                  </div> 
                </div>
              </div>
            </div>  
          </div>
          <div v-if="!showQuestion">
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
        uiLabels: Object,
        currentValue: Number,
        correctAnswer:String
      },
      data: function(){
        return{
          pollId: "",
          questionActive:false,
          timeLeftBeforeQuestion:0,
          percentage:100,
          questionLetters:['A','B','C','D'],
          showQuestion:false,
          showCorrectAnswer:false
          }
      },
      created: function (){
        this.pollId = this.$route.params.id;
        socket.emit( "joinPoll", this.pollId );
      },
      mounted(){
        console.log("correctAnswer i mounted: ",this.correctAnswer)
        this.countdownResult()
      },
      methods:{
        //ha countdown här, när den är färdig skickas metod till vanliga som skickar socket.emit + gör denna osynlig
        countdownResult: function(){
          console.log("fråga borde visas")
          let startTime = Date.now();
          let timeLeftTest;
          let endQuestion = false;

          let timerDuration = 19000;
          let timerQuestion = 16000;
          let timerAnswer = 11000;
          let showAnswer = 1000;
          
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

            if (timeLeftTest > timerQuestion) {
              this.timeLeftBeforeQuestion = Math.floor((3000 - elapsedTime)/1000);
            } else if (timeLeftTest>timerAnswer){
              this.showQuestion = true
            }
             else if (timeLeftTest > showAnswer) {
              this.questionActive = true;
              this.percentage = Math.floor((timeLeftTest-1000) / 100);
            } else if (timeLeftTest>0){
              this.percentage=0;
              this.showCorrectAnswer=true
            }
            else {
                console.log('kör clearInterval orginal')
                clearInterval(interval)
                this.$emit("countDownOverSend")
              //skicka till resultatview att köra funktionen
            }
          }, 100);  
        },
      }
    }
</script>
<style>
.rectangle{
  width: 100%;
  height: 100%;
  /*background: linear-gradient(#393a93, #7bb0f3, #393a93); */
  background-color: #101c3e;
  clip-path: polygon(15% 0%, 85% 0%, 100% 50%, 85% 100%, 15% 100%, 0% 50%);
  align-content: center;
  justify-content: center;
  position: relative;
  
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
  background-color: lightyellow;
  box-shadow: 0 0 5px lightyellow;
}
.rectangle h3{
  align-content: center;
  justify-content: center;
  color: white;
}
.rectangle p{
  position: absolute;
  color:black;
  margin:0;
  left:50%;
  transform: translate(-50%,-50%);
  font-weight: bold;
}

#rectangleContainer{
  bottom:5%;
  width: 100%;
  height: 40%;
  display: grid;
  grid-template-columns: 50% 50%;
  grid-row: auto auto;
  justify-content: center;
  position:absolute;
  margin: auto;
  animation: showAnswers 0.5s;
}
@keyframes showAnswers {
  0%{
    opacity: 0;
  }
  100%{
    opacity: 1;
  }
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
  overflow:hidden;
  margin: auto;
  z-index: 3;
  /*left:50%;
  top:40%;*/
  /*transform: translate(-50%,-50%);*/
  background: linear-gradient(45deg,#0f131f, #3a3790, #0f131f);
  position: absolute;
}
#questionFrame h1,h2{
  color:White;
}
.rectangle span{
  color: #FF851B;
  left:15%;
  position: absolute;
}
#progressbar{
  width:100%;
  overflow:hidden;
  height:20px;
  background-color: lightgray;
  margin-left:auto;
  margin-right: auto;
}
#progress{
  width:100%;
  height:100%;
  background-color: #FF851B;
  transition: width 0.1s;
}
@keyframes shake {
  0%{
    transform: translateY(0);
  }
  50%{
    transform: translateY(10%);
    background-color: red;
    box-shadow: 0 0 20px red;
    /**blinka rött */
  }
  100%{
    transform: translateY(0);
  }
}
#question{
  width: 100%;
  height: 100%;
  position: relative;
  margin-top:10%;
  background-color: #101c3e;
}
.borderRect{
  clip-path: polygon(15% 0%, 85% 0%, 100% 50%, 85% 100%, 15% 100%, 0% 50%);
  border: 2px solid lightyellow;
  position: absolute;
  width: 90%;
  height: 50%;
  background-color: lightyellow;
  top: 50%;  
  left: 50%; 
  transform: translate(-50%, -50%); 
  box-shadow: 0 0 5px lightyellow;
}
</style>
