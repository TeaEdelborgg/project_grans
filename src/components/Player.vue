<template>
  <div id="boxes">
    <div id="containerBox">
      <Levelbox v-for="n in amountOfQuestions" :ref="'box-'+n" v-bind:BoxColor="color" v-bind:BorderColor="color":id="n"></Levelbox>
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
    }
  },
  mounted(){
    this.color=this.player.information.color
    console.log("färg i watch: ",this.color)
  },
  /*watch:{
    amountOfQuestions(){
      for (let n=0; n< this.amountOfQuestions; n++){
        this.coloredBoxes.push(false)
      }
    }
  },*/
  //emits: ["answer"],
  methods: {
    updatesBoxes(){
      for(let i=0; i<Object.keys(this.player.information.coloredBoxes).length;i++){
        const box = this.$refs[`box-${i+1}`][0]
        if(box){
          box.updateColor(this.player.information.coloredBoxes[i])
        }
      }
    }
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
  border-radius:10px;
  border-style:dashed;
  /*border-color:#FF851B;*/
}
</style>