<template>
    <div id="movingBorder">
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
#movingBorder{
    display: flex;
    position: relative;
    height: 90%;
    width: 70%;
    margin: auto;
    margin-left: 15%;
    margin-right: 5%;
    background-color: red;
    border-radius: 5%;
    padding:1%;
    border-style: solid;
    border-width: 5px;
    border-color: #14144d;
    box-shadow:0 0 20px rgba(255, 255, 255, 0.5), 0 0 20px rgba(255, 255, 255, 0.5), 0 0 30px rgba(255, 255, 255, 0.5), 0 0 40px rgba(255, 255, 255, 0.5);
    background-image: linear-gradient(45deg, #f6860c, #ffe9d1);
    animation: gradientMove 3s linear infinite;
    background-size: 200% 200%;
    display: flex;
    justify-content: center;
    align-items: center;
    /*margin-top:4%;*/
}
@keyframes gradientMove {
    0%{
        background-position: 100% 0;
    }
    50%{
        background-position: 0 100%;
    }
    100%{
        background-position: 100% 0;
    }
}
#frame{
  height:100%; /*osäker på hur stor den ska va*/
  width: 100%;
  border-style:solid;
  border-color:#14144d;
  border-radius: 5%;
  border-width:5px;
  background: linear-gradient(to right, #393a93, #7bb0f3, #393a93); 
  /*box-shadow:0 0 20px rgba(255, 255, 255, 0.5), 0 0 20px rgba(255, 255, 255, 0.5), 0 0 30px rgba(255, 255, 255, 0.5), 0 0 40px rgba(255, 255, 255, 0.5);*/
  display:flex;
  position: relative
}
#moneyframe{
  /*background-color: #39A2DB;*/
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
  /*background-color: #4b6ab8;*/
  margin: auto;
}
.test2{
    display: flex;
    width: 100%;
    height: 100%;
    position:absolute;
}
</style>
