<template>
    <div class="moneybox" :style="{backgroundColor:moneyColor}">
        {{value}}
    </div>
</template>
<script>
    export default{
        name:'MoneyBox',
        data: function(){
            return{
                moneyColor: "gray",
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
                    this.moneyColor="yellow"
                }
                else if(col == "next"){
                    this.moneyColor="purple"
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
