<template>
    <div class="moneybox">
        <div :class="{
            lightBulb: boxState === 'done',
            darkLightBulb: boxState == 'future',
            blinkingLightBulb: boxState == 'next'
        }"></div>
        <p>{{value}}</p>
        <div :class="{
            lightBulb: boxState === 'done',
            darkLightBulb: boxState == 'future',
            blinkingLightBulb: boxState == 'next'
        }"></div>
    </div>
</template>
<script>
    export default{
        name:'MoneyBox',
        props:{
            boxState: String,
            value: Number
        },
}
</script>
<style scoped>
.moneybox{
    flex:1;
    width: 80%;
    max-height: 100%;
    height: auto;
    margin: auto;
    margin:5%;
    justify-content: space-evenly;
    align-items: center;
    flex-direction: row;
    display:flex;
    border-radius:10%;
    border-color:black;
    border-style: solid;
    background-color: #14144d;
    box-shadow:0 0 15px #f9ac33; 
    padding:0.5%;
}
.moneybox p{
    color:#f9ac33;
    font-weight: bold;
    font-size: 1.2em;
    margin:0;
}
.moneybox div{
    width: 50%;
    height: 50%;
    max-width: 20px;
    max-height: 20px;
    border-radius: 50%;
    border-width: 10%;
    border-style: solid;
}
.lightBulb{
    background-color: lightyellow;
    border-color: lightyellow;
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.5), 0 0 20px rgba(255, 255, 255, 0.5), 0 0 30px rgba(255, 255, 255, 0.5), 0 0 40px rgba(255, 255, 255, 0.5);
}
.darkLightBulb{
    background-color: gray;
}
.blinkingLightBulb{
    background-color: gray;
    border-color: lightyellow;
    animation: blinking 2s infinite;
}
@keyframes blinking {
    0%{
        box-shadow: 0 0 10px rgba(255, 255, 0, 0.5);
        background-color: gray;
        border-color: black;
    }
    50%{
        box-shadow: 0 0 20px rgba(255, 255, 255, 0.5), 0 0 20px rgba(255, 255, 255, 0.5), 0 0 30px rgba(255, 255, 255, 0.5), 0 0 40px rgba(255, 255, 255, 0.5);
        background-color: lightyellow;
        border-color: lightyellow;
    }
    100%{
        box-shadow: 0 0 10px rgba(255, 255, 0, 0.5);
        background-color: gray;
        border-color: black;
    }
}
</style>
