<template>
    <div class="levelbox" :style="{backgroundColor:boxColor, borderColor:BorderColor}">
    </div>
    
</template>
<script>
    export default{
        name:'Levelbox',
        props:{
            BoxColor: String,
            BorderColor:String
        },
        data: function(){
            return{
                boxColor: '#7FDBFF'
            }
        },
        mounted(){
            console.log("färg i mounted: ",this.BoxColor)
        },
        methods:{
            updateColor: function(col){
                if(col){
                    //backgroundCol.style.backgroundColor = "yellow"
                    //this.boxColor=this.BoxColor
                    this.boxColor=this.BoxColor
                }
                /*else{
                    //backgroundCol.style.backgroundColor = "red"
                    this.boxColor="red"
                }*/
            }
        }
}
</script>
<style scoped>

</style>