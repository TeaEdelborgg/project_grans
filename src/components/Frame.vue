<template>
    <div id="movingBorder">
        <div v-if="!questionActive" class="frame">
            <div id="moneyframe">
                <Moneybox v-for="index in amountOfQuestions" v-bind:boxState="moneyBoxes[index-1]" v-bind:value="moneyValues[index-1]" :id="index"/>
            </div>
            <div id="playersFrame">
                <Player v-if="participants.length>0"  v-for="player in participants" v-bind:player="player" v-bind:amountOfQuestions="amountOfQuestions":key="player.id" />
            </div>
        </div>
        <div v-if="questionActive" class="frame">
            <QuestionCountDown v-if="questionActive" v-bind:currentValue="moneyValues[questionNumber]" v-bind:correctAnswer="correctAnswer" v-bind:uiLabels="uiLabels" v-bind:question="question" v-on:countDownOverSend="countDownOverSend" ></QuestionCountDown> <!--Sätta den i frame så som en TV?-->
        </div>
    </div>
    
</template>
<script>
import Moneybox from '@/components/Moneybox.vue';
import Player from '@/components/PlayerPillar.vue';
import QuestionCountDown from '@/components/QuestionCountDown.vue';

export default{
        name:'Frame',
        components:{
            Moneybox,
            Player,
            QuestionCountDown
        },
        props:{
            amountOfQuestions:Number,
            moneyBoxes:Array,
            moneyValues:Array,
            participants:Object,
            questionActive:Boolean,
            question: Object, 
            uiLabels: Object,
            questionNumber:Number,
            correctAnswer:String
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
    border-radius: 5%;
    padding:1%;
    box-shadow:0 0 20px rgba(255, 255, 255, 0.5), 0 0 20px rgba(255, 255, 255, 0.5), 0 0 30px rgba(255, 255, 255, 0.5), 0 0 40px rgba(255, 255, 255, 0.5);
    background-image: linear-gradient(45deg, #f79701, #feeacc);
    animation: gradientMove 3s linear infinite;
    background-size: 200% 200%;
    display: flex;
    justify-content: center;
    align-items: center;
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
#moneyframe{
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
  margin: auto;
}
.frame{
    display: flex;
    width: 100%;
    height: 100%;
    position:relative;
    overflow:hidden;
    background: radial-gradient( #7bb0f3,#393a93); 
    border-radius: 3%;
}
</style>
