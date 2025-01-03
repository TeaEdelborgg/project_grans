<template>
    <div id="frame">
        <div v-if="!questionActive" class="test2">
            <div id="moneyframe">
                <Moneybox v-for="index in amountOfQuestions" v-bind:boxState="moneyBoxes[index-1]" v-bind:value="moneyValues[index-1]" :id="index"/>
            </div>
            <div id="playersFrame">
                <Player v-if="participants.length>0"  v-for="player in participants" v-bind:player="player" v-bind:amountOfQuestions="amountOfQuestions":key="player.id" />
            </div>
        </div>
        <div v-if="questionActive" class="test2">
            <QuestionComponentResult v-if="questionActive" v-bind:uiLabels="uiLabels" v-bind:question="question" v-on:countDownOverSend="countDownOverSend" ></QuestionComponentResult> <!--Sätta den i frame så som en TV?-->
        </div>
    </div>
</template>
<script>
import Moneybox from '@/components/Moneybox.vue';
import Player from '@/components/Player.vue';
import QuestionComponentResult from '@/components/QuestionComponentResult.vue';

export default{
        name:'Frame',
        components:{
            Moneybox,
            Player,
            QuestionComponentResult
        },
        props:{
            amountOfQuestions:Number,
            moneyBoxes:Array,
            moneyValues:Array,
            participants:Object,
            questionActive:Boolean,
            question: String, //detta ska sedan även innehålla alla svar
            uiLabels: Object

        },
        data: function(){
            return{
                //boxColor: '#7FDBFF'
            }
        },
        methods:{
            countDownOverSend: function(){
                this.$emit("countDownOver")
            }
        },
}
</script>
<style>
#frame{
  height:80%; /*osäker på hur stor den ska va*/
  width: 70%;
  margin: auto;
  margin-left: 15%;
  margin-right: 5;
  border-style:solid;
  border-color:#FF851B;
  border-width:5px;
  display:flex;
  margin-top:4%;
  position: relative;
}
#moneyframe{
  background-color: #39A2DB;
  height: 100%;
  width: 20%;
  display: flex;
  justify-content: space-evenly;
  flex-direction: column-reverse;
}
#playersFrame{
  width:80%;
  display: flex;
  justify-content: space-evenly;
  height:100%;
  background-color: #4b6ab8;
  margin: auto;
}
.test2{
    display: flex;
    width: 100%;
    height: 100%;
    position:absolute;
}
</style>
