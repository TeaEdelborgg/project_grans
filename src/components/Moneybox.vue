<template>
    <div class="moneybox" :style="{backgroundColor:moneyColor, borderColor:borderColor, borderStyle:borderStyle}">
        {{value}}
    </div>
</template>
<script>
    export default{
        name:'MoneyBox',
        data: function(){
            return{
                moneyColor: "#7FDBFF",
                borderColor:"#FF851B",
                borderStyle:"dashed",
                value:0,
            }
        },
        /*props:{
            value: Number
        },*/
        methods:{
            updateColor: function(col){
                //om done, gul, om next, ljusare gul, om future, grå
                console.log("uppdaterar box: ",col)
                if(col=="done"){
                    //backgroundCol.style.backgroundColor = "yellow"
                    //this.boxColor=this.BoxColor
                    console.log("yellow")
                    this.moneyColor="#FF851B"
                    this.borderStyle='solid'
                }
                else if(col == "next"){
                    this.moneyColor="#FFAD66"
                    this.borderColor='black'
                }
                /*else{
                    //backgroundCol.style.backgroundColor = "red"
                    this.boxColor="red"
                }*/
            },
            updateValue: function(val){
                console.log("uppdaterar värde: ",val)
                this.value=val
            }
        }
}
</script>
<style scoped>

</style>
