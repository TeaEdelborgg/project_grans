<template>
  <div class="playerview">
    <p>{{question.q}}</p> <!-- ta bort sen i slutet -->
    <button class="answeralternative" 
      :class="{ 
        selected: a === selectedAnswer, 
        sended: a === selectedAnswer && sent, 
        showCorrect: a === selectedAnswer && showCorrectAnswer && a === question.correct,
        showIncorrect: a === selectedAnswer && showCorrectAnswer && a !== question.correct}" 
      v-for="a in question.a" 
      v-on:click="selectAnswer(a)" 
      v-bind:key="a">
      {{ a }}
    </button> <br/>
    
    <!--<button class="submitbutton" v-on:click="answer">
      Submit answer
    </button>-->
    
    <div id="slidercontainer">
        <SliderCompoment @sendAnswer="answer"/>
      </div>
  </div>
  
</template>

<script>
import SliderCompoment from './SliderCompoment.vue';

export default {
  name: 'QuestionComponent',
  components: {
    SliderCompoment
  },
  props: {
    question: Object,
    questionActive: Boolean,
    showCorrectAnswer: Boolean,
    checkedAnswer: Boolean,
  },
  data: function(){
    return{
      selectedAnswer:'',
      sent:false
      }
  },
  emits: ["answer"],
  methods: {
    answer: function () {
      if (!this.sent){
        console.log('innan skickat', this.sent)
        this.sent=true
        this.$emit("answer", this.selectedAnswer); 
        console.log('skickat ', this.sent)
      }
    },
    updateSent: function() {
      this.sent = false
    },
    selectAnswer: function(answer){
      if (this.questionActive && !this.sent) {
        console.log('selectanswer: ', answer)
        this.selectedAnswer = answer
      }
    }

  },
  mounted(){
    this.sent=false
  }
}
//ha en "selected button, så om en knapp trycks på så väljs den knappen till selected, den ändrar också färg?"
</script>

<style scoped>

  .answeralternative {
    background-color: #f79743;
    border-color: #FFAD66;
    border-style: solid;
    color: #FAF8F1;
    border-radius: 1em;
    margin: 2vh 2vw;
    width: 35vw;
    height: 20vh;
  }
  .selected {
    background-color: #FF5700;
    border-color: #FF5700;
    color: white; 
  }
  .sended {
    background-color: #FFAD66; 
    border-color: #FFAD66;
    color: white; 
  }
  .showCorrect {
    background-color: #2ECC40; 
    border-color: #2ECC40;
    color: white;
  }
  .showIncorrect {
    background-color: #FF4136; 
    border-color: #FF4136;
    color: white;
  }
  .submitbutton {
    width: 80vw;
  }
  #slidercontainer{
  background-color: greenyellow;
}

</style>