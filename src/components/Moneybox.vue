<template>
    <div class="moneybox">
    <!--<div class="moneybox" :style="{backgroundColor: getBackgroundColor(), borderColor:getBorderColor(), borderStyle:getBorderStyle()}">-->
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
    <!--</div>-->
    </div>
</template>
<script>
    export default{
        name:'MoneyBox',
        props:{
            boxState: String,
            value: Number
        },
        data: function(){
            return{
                /*moneyColor: "#7FDBFF",
                borderColor:"#FF851B",
                borderStyle:"dashed", //lägg direkt i style*/
            }
        },
        methods:{
            /*getBackgroundColor: function(){
                if(this.boxState=="done"){
                    return "#FF851B"
                }
                else if(this.boxState=="next"){
                    return "#FFAD66"
                }
                return "#7FDBFF"
            },
            getBorderColor: function(){
                if(this.boxState=="done" || this.boxState=="next"){
                    return 'black'
                }
                return "#FF851B"
            },
            getBorderStyle: function(){
                if(this.boxState=="done"){
                    return "solid"
                }
                return "dashed"
            },*/
        }
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
    box-shadow:0 0 20px rgba(255, 255, 255, 0.5), 0 0 20px rgba(255, 255, 255, 0.5), 0 0 30px rgba(255, 255, 255, 0.5), 0 0 40px rgba(255, 255, 255, 0.5);
    padding:0.5%;
}
.moneybox p{
    color:#FF851B;
    font-weight: bold;
    font-size: 1.2em;
    text-shadow: 0 0 20px rgba(254, 208, 70, 0.3), 0 0 20px rgba(254, 208, 70, 0.5), 0 0 20px rgba(254, 208, 70, 0.7);
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
