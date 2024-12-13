<template>
  <div id="boxes">
    <div id="containerBox">
        <Levelbox v-for="n in amountOfQuestions" :id="n"></Levelbox>
        <!--namn: {{player.information.name}} svar: {{ player.information.answers }} corrected Answers: {{ player.information.correctedAnswers }}-->
    </div>
  </div>
</template>

<script>
import Levelbox from './Levelbox.vue';

export default {
  name: 'Player',
  props: {
    player: Object,
    amountOfQuestions: Number
  },
  components:{
    Levelbox
  },
  data: function(){
    return{
      color:"",
      out:false,
      coloredBoxes:[]
    }
  },
  created:function (){
    this.color=this.player.information.color
    for (n in this.amountOfQuestions){
      this.coloredBoxes.push(false)
    }
  },
  //emits: ["answer"],
  methods: {
    updateBoxes(){
      if(!out){
        if(this.player.information.lives==0){
          this.out = true
        }
        else if(this.player.information.lives >0 ){
          let answers = this.player.information.correctedAnswers;
          for(i in answers){
            this.coloredBoxes[this.amountOfQuestions-1-i] = true;
          }

        }
      }

      }
      //titta om livet är 0, isåfall ska färgen inte uppdateras
    }
    //från player ska vi kalla på en funktion i resultat som sedan kallar på en funktion i data som tittar om svaren är korrekt.
}
</script>
<style>
#containerBox{
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  height: 100%;
  margin:auto
}
#boxes{
  width:100%;
  display: flex;
  justify-content: space-evenly;
  height:100%;
  background-color: black;
  margin: auto;
}
#levelbox{
  flex: 1; 
  width: 80%;
  height:100%;
  margin:5px 0;
  margin-left:auto;
  margin-right: auto;
  background-color: lightgray;
  justify-content: center;
  align-items: center;
  display: flex;
}
</style>