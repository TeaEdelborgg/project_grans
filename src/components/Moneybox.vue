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
        created(){
            console.log("boxState: ",this.boxState," value: ",this.value)
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
            /*updateColor: function(col){
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
                }
            },
            updateValue: function(val){
                console.log("uppdaterar värde: ",val)
                this.value=val
            }*/
        }
}
</script>
<style scoped>

</style>
