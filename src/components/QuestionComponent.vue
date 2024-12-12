<template>
  <div class="playerview">
    <p>{{question.q}}</p> <!-- ta bort sen i slutet -->
    <button class="answeralternative" v-for="a in question.a" v-on:click="selectAnswer(a)" v-bind:key="a">
      {{ a }}
    </button> <br/>
    
    <button class="submitbutton" v-on:click="answer">
      Submit answer
    </button>
  </div>
  
</template>

<script>
export default {
  name: 'QuestionComponent',
  props: {
    question: Object
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
        this.sent=true
        this.$emit("answer", this.selectedAnswer); //ändra här
        console.log('skickat')
      }
    },
    updateSent: function() {
      this.sent = false
    },
    selectAnswer: function(answer){
        console.log('selectanswer: ', answer)
        this.selectedAnswer = answer
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
    /*background-color: #556B2F;
    border-color: #5c2c13;
    color: #FAF8F1;*/
    border-radius: 1em;
    margin: 1em;
    width: 40vw;
    height: 20vh;
  }

  .submitbutton {
    width: 80vw;
  }

</style>