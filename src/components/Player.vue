<template>
  <div id="boxes">
    <div id="containerBox">
      <Levelbox v-for="n in amountOfQuestions" :ref="'box-'+n" v-bind:BoxColor="color" :id="n"></Levelbox>
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
      color:"gray",
      out:false,
      coloredBoxes:[]
    }
  },
  mounted(){
    this.color=this.player.information.color
    console.log("färg i watch: ",this.color)
  },
  watch:{
    amountOfQuestions(){
      for (let n=0; n< this.amountOfQuestions; n++){
        this.coloredBoxes.push(false)
      }
    }
  },
  //emits: ["answer"],
  methods: {
    updatesBoxes(){ //gör denna funktion i data sen
      console.log("i update boxes")
      if(!this.out){
        if(this.player.information.lives==0){
          this.out = true
        }
        else if(this.player.information.lives >0 ){
          console.log("corrected answers: ",this.player.information.correctedAnswers)
          console.log("colored boxes: ", this.coloredBoxes)
          let answers = this.player.information.correctedAnswers;
          for(let i=0; i< Object.keys(answers).length;i++){
            console.log("i for loop update: ",i)
            this.coloredBoxes[i] = true; //-i
          }
          console.log("colored boxes efter loop: ",this.coloredBoxes)
        }
      }
      //console.log("coloredboxes: ",this.coloredBoxes)
      //console.log("this.refs: ",this.$refs)
      for(let i=0; i<Object.keys(this.coloredBoxes).length;i++){
        const boxRef = this.$refs[`box-${i+1}`][0]
        //console.log("boxref: ",boxRef)
        //console.log("boxref metoder, ", Object.keys(boxRef))
        //console.log("boxref instance: ",boxRef.$.type.name)
        if(boxRef){
          boxRef.updateColor(this.coloredBoxes[i])
        }
      }

    }  //titta om livet är 0, isåfall ska färgen inte uppdateras
  }  //från player ska vi kalla på en funktion i resultat som sedan kallar på en funktion i data som tittar om svaren är korrekt.
}
</script>
<style>
#containerBox{
  width: 100%;
  display: flex;
  flex-direction: column-reverse;
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
.levelbox{
  flex: 1; 
  width: 80%;
  height:100%;
  margin:5px 0;
  margin-left:auto;
  margin-right: auto;
  background-color: gray;
  justify-content: center;
  align-items: center;
  display: flex;
}
</style>