<template>
    <div class="moneybox" :style="{backgroundColor: getBackgroundColor(), borderColor:getBorderColor(), borderStyle:getBorderStyle()}">
        {{value}}
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
                moneyColor: "#7FDBFF",
                borderColor:"#FF851B",
                borderStyle:"dashed", //lägg direkt i style
            }
        },
        methods:{
            getBackgroundColor: function(){
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
            },
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
    justify-content: center;
    align-items: center;
    display: flex;
    border-radius:10px ;
}
</style>
