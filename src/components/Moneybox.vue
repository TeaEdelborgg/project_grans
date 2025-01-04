<template>
    <div class="moneybox">
    <!--<div class="moneybox" :style="{backgroundColor: getBackgroundColor(), borderColor:getBorderColor(), borderStyle:getBorderStyle()}">-->
        <div :class="{
            lightBulb: boxState === 'done',
            darkLightBulb: boxState == 'future',
            blinkingLightBulb: boxState == 'next'
        }"></div>
        <h2>{{value}}</h2>
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
    margin: auto;
    margin-top:5%;
    margin-bottom: 5%;
    justify-content: space-evenly;
    align-items: center;
    display: flex;
    border-radius:10px ;
    border-color:black;
    border-style: solid;
    background-color: #14144d;
    box-shadow:0 0 20px rgba(255, 255, 255, 0.5), 0 0 20px rgba(255, 255, 255, 0.5), 0 0 30px rgba(255, 255, 255, 0.5), 0 0 40px rgba(255, 255, 255, 0.5);
}
.moneybox h2{
    color:#FF851B;
    font-weight: bold;
    text-shadow: 0 0 20px rgba(254, 208, 70, 0.3), 0 0 20px rgba(254, 208, 70, 0.5), 0 0 20px rgba(254, 208, 70, 0.7);
}
.moneybox div{
    width: 20%;
    height: 20%;
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
