<template>
  <div id="background">
    {{pollId}}
    <div class="answeralternatives" v-if="questionActive">
      <QuestionComponent ref="questionComponent" v-bind:question="question"
              v-on:answer="submitAnswer($event)"/>
    </div>
    
    <hr>
    <span>{{submittedAnswers}}</span>
    Checked answer {{ checkedAnswer }}
  </div>
</template>

<script>
// @ is an alias to /src
import QuestionComponent from '@/components/QuestionComponent.vue';
import io from 'socket.io-client';
const socket = io("localhost:3000");

export default {
  name: 'PollView',
  components: {
    QuestionComponent
  },
  data: function () {
    return {
      question: {
        q: "",
        a: []
      },
      pollId: "inactive poll",
      submittedAnswers: {},
      questionRandom:{
        q:"",
        a:[]
      },
      questionNumber: null,
      checkedAnswer: false,
      questionActive: false,
    }
  },
  created: function () {
    this.pollId = this.$route.params.id;
    this.userId = this.$route.params.userId;
    /*socket.on( "questionUpdate", q => { 
      console.log("tog emot fråga, ", q)
      this.question = q; 
      this.$refs.questionComponent.updateSent();              
     }); */
    /*socket.on("randomOrderUpdate", q =>{
      console.log("tog emot ranodm fråga, ",q.q);
      this.question=q.q;
      this.questionNumber=q.questionNumber;
      console.log("tog emot random fråga, ",q.questionNumber)
      //this.$refs.questionComponent.updateSent(); 
    })*/
    socket.on( "submittedAnswersUpdate", answers => this.submittedAnswers = answers );
    socket.on( "uiLabels", labels => this.uiLabels = labels );
    socket.on("checkedUserAnswer", checkedAns => {
      this.checkedAnswer = checkedAns;
      console.log("tagit emot checked Answer: ",checkedAns)
    });
    /*socket.on("timeUp",up =>{
      console.log("tittar om timeUp")
      if(up==true){
        this.timeUp();
      }
    });*/ 
    socket.emit( "getUILabels", this.lang );
    socket.emit( "joinPoll", this.pollId );

    //ny socket till countdown
    socket.on('startCountdownPlayer', question =>{
      this.question=question.q;
      this.questionNumber=question.questionNumber;
      this.countdownPlayer();
    })
  },
  methods: {
    submitAnswer: function (answer) { //här måste correct answer också va med, inte bara answer
      //titta i servern hur tid och svar kopplas, du vill koppla tiden här direkt så att det stämmer med personens 
      //timer och inte servern!!!!
      // ska skickas som [svaret de valt, tid kvar], kolla i data
      // kolla så att allt som varit koppat till serven fortfarande är det
      socket.emit("submitAnswer", {pollId: this.pollId, answer: answer, userId: this.userId}) // ta bort correctAnswer
      console.log('svar: ', answer)
    },
    timeUp: function(){
      socket.emit("checkUserAnswer", {pollId:this.pollId, questionNumber:this.questionNumber,userId:this.userId}) //den ska sedan vara när timern går ut
    }, 
    countdownPlayer: function() {
      let startTime = Date.now();

      let timerDuration = 13000;
      let timerAnswer = 10000;
      
      let interval = setInterval(() =>{
        let elapsedTime = Date.now() - startTime;
        let timeLeftTest = timerDuration - elapsedTime;

        if (timeLeftTest > timerAnswer) {
          console.log('PollView, tid innan frågan: ', timeLeftTest - timerAnswer)
        } else if (timeLeftTest > 0) {
          this.questionActive = true;
          console.log('PollView, tid kvar för att svara: ', timeLeftTest)
        } else {
          this.questionActive = false;
          clearInterval(interval)
          console.log('PollView, interval clear')
          this.timeUp() //rättar svaret, kanske ska finnas en delay?
        }
      }, 1000);  
    },
  },
  // lägg till computed där vi hämtar userId

/*
computed: {
  userId() {
    return this.$route.params.userId;
  }
}
*/
mounted (){
    this.windowHeight = document.documentElement.clientHeight
    this.windowWidth = document.documentElement.clientWidth;
    const backgroundPlayer = document.getElementById('background');
    backgroundPlayer.style.width=this.windowWidth +"px";
    backgroundPlayer.style.height=this.windowHeight + "px";
  },
  
}
</script>

<style>
  .answeralternatives {
    height: 100%;
    width: 100%;
    justify-content: space-evenly;
  } 

 #background {
  background-color: #444;
  position: fixed;
 }
</style>