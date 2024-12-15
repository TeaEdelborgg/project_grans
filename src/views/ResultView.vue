<template>
  <div id="background">
    <div>
      lang: {{ lang }}
    </div>
    
    <!--<BarsComponent v-bind:labels="question.a" v-bind:data="submittedAnswers"/>-->
    <QuestionComponentResult v-if="questionActive" v-bind:progress="percentage" v-bind:question="question"  ></QuestionComponentResult> <!--Lägg till questionId senare-->
    <BeforeQuestionComponent v-if="beforeQuestion" v-bind:timeLeft="timeLeftBeforeQuestion" ></BeforeQuestionComponent>
      <div id="frame">

        <div id="moneyframe">
            <div id="switchout">
              <div id="boxesTest">
                <div id="containerBoxTest">
                  <Moneybox v-for="level in amountOfQuestions" :ref="'level-'+level" :id="level"/>
                </div>
              </div>
            </div>
        </div>

        <div id="players">
        <!-- Lägg in componenter för varje steg för priset -->
          <div class="contain">
            <Player v-if="participants.length>0"  v-for="player in participants" :ref="player.userId" v-bind:player="player" v-bind:amountOfQuestions="amountOfQuestions":key="player.id" id="player"/>
          </div>
        </div>
      </div>
    <br>
    <div id="pedestaler">
          <PlayerPedestal v-show="participants.length>0" v-for="player in participants" v-bind:player="player" :key="player.id" class="pedestal"/>
    </div>
    
  </div>
</template>

<script>
// @ is an alias to /src
import BarsComponent from '@/components/BarsComponent.vue';
import Player from '@/components/Player.vue';
import PlayerPedestal from '@/components/PlayerPedestal.vue';
import io from 'socket.io-client';
import QuestionComponentResult from '@/components/QuestionComponentResult.vue';
import BeforeQuestionComponent from '@/components/BeforeQuestionComponent.vue';
import Moneybox from '@/components/Moneybox.vue';
const socket = io("localhost:3000");

export default {
  name: 'ResultView',
  components: {
    BarsComponent,
    Player,
    PlayerPedestal,
    QuestionComponentResult,
    BeforeQuestionComponent,
    Moneybox
  },
  data: function () {
    return {
      lang: localStorage.getItem("lang") || "en",
      pollId: "",
      //question: {q: " ", answers: []}, //ändra så att question bara är tomt
      question:"",
      submittedAnswers: {},
      participants: [],
      timeLeft:0,
      timeLeftBeforeQuestion:0,
      questionActive:false,
      beforeQuestion:false,
      windowHeight:0,
      windowWidth:0,
      percentage:100,
      amountOfQuestions:0,
      userId:'',
    }
  },
  created: function () {
    this.pollId = this.$route.params.id
    socket.on( "uiLabels", labels => this.uiLabels = labels );
    //socket.on("submittedAnswersUpdate", update => this.submittedAnswers = update);
   //behlver inte tror jag socket.on("questionUpdateResult", update => this.question = update );
    socket.on( "participantsUpdate", p => {
      this.participants = p;
    })
    socket.on("sendAllAnswers", p=>{ //ändra till d
      this.participants = p[0]
      let moneyBox = p[1]
      this.$nextTick(()=>{
        this.participants.forEach(play=>{
          const playerArray = this.$refs[play.userId]
          const player = playerArray?.[0]
          if(player){
            player.updatesBoxes()
          }
        })
        for(let i=0; i<Object.keys(moneyBox).length;i++){
          const box = this.$refs[`level-${i+1}`][0]
          if(box){
            box.updateColor(moneyBox[i])
          }
        }
      })
    })

    socket.on('startCountdownResults', question =>{ 
      this.question=question;
      this.countdownResult();
    });
    socket.on('sendAmountQuestions', value => {
      this.amountOfQuestions=value[0]
      let moneyLevels = value[1]
      this.$nextTick(()=>{
        for (let i =0; i<Object.keys(moneyLevels).length;i++){
        
        console.log("Alla refs:", this.$refs);
        console.log("Försöker hitta:", `level-${i+1}`);
        console.log("Hittad ref:", this.$refs[`level-${i+1}`]);
        const box = this.$refs[`level-${i+1}`][0]
        if(box){
          box.updateValue(moneyLevels[i])
        }
      }
      })
      console.log("antal frågor: ",value)
    })

    socket.emit( "getUILabels", this.lang );
    socket.emit( "joinPoll", this.pollId );
    socket.emit("updateResult", this.pollId);
    

  },
  mounted (){
    socket.emit('getAmountQuestions', this.pollId);

    this.windowHeight = document.documentElement.clientHeight
    this.windowWidth = document.documentElement.clientWidth;
    const backgroundResult = document.getElementById('background');
    backgroundResult.style.width=this.windowWidth +"px";
    backgroundResult.style.height=this.windowHeight + "px";
  },
  methods:{
    countdownResult: function(){
      let startTime = Date.now();

      let timerDuration = 13000;
      let timerAnswer = 10000;
      
      let interval = setInterval(() =>{
        //behöver skicka tiden till komponenterna
        let elapsedTime = Date.now() - startTime;
        let timeLeftTest = timerDuration - elapsedTime;

        if (timeLeftTest > timerAnswer) {
          this.beforeQuestion = true
          this.timeLeftBeforeQuestion = Math.floor((3000 - elapsedTime)/1000);
        } else if (timeLeftTest > 0) {
          this.beforeQuestion = false
          this.questionActive = true;
          this.percentage = Math.floor(timeLeftTest / 100);
        } else {
          clearInterval(interval)
          setTimeout(()=>{
            socket.emit("getAllAnswers", this.pollId)
            socket.emit("getAllAnswersTest", this.pollId)
            this.questionActive=false
            this.percentage =100
          },2000)
        }
      }, 100);  
    },
    


  }
}
</script>

<style>
#pedestaler{
  width:80%;
  display: flex;
  justify-content: space-evenly;
  height:200px;
  background-color: grey;
  margin:auto;
}
.pedestal{
  flex:1;
 max-width: 10%;
  height:100px;
  margin:auto;
}
#players{
  width:80%;
  display: flex;
  justify-content: space-evenly;
  height:400px;
  background-color: aquamarine;
  margin: auto;
}
#player{
  flex:1;
  max-width: 80%;
  background-color: white;
  height: 300px;
  margin:5px
}
.contain{
  width: 80%;
  display: flex;
  margin:auto;
}
#background{
  background-color: wheat;
  position: fixed;
  z-index: 1;
}
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
#frame{
  height:400px;
  width: 80%;
  margin: auto;
}
#moneyframe{
  float: left;
  background-color: purple;
  height: 400px;
  width: 20%;
  margin:auto;
}

#switchout{
  width:80%;
  background-color: white;
  height: 300px;
  margin:auto;
}
.moneybox{
  flex: 1; 
  width: 100%;
  margin:5px 0;
  background-color: gray;
  justify-content: center;
  align-items: center;
  display: flex;
}
#containerBoxTest{
  width: 100%;
  display: flex;
  flex-direction: column-reverse;
  justify-content: space-evenly;
  height: 100%;
  margin:auto
}
#boxesTest{
  width:100%;
  display: flex;
  justify-content: space-evenly;
  height:100%;
  background-color: black;
  margin: auto;

  
}


</style>
