<template>
    <div class="levelbox" :style="{backgroundColor:boxColor}">
        hej
    </div>
    
</template>
<script>
    export default{
        name:'Levelbox',
        props:{
            BoxColor: String
        },
        data: function(){
            return{
                boxColor: "gray"
            }
        },
        mounted(){
            console.log("färg i mounted: ",this.BoxColor)
        },
        methods:{
            updateColor: function(col){
                console.log("färg i updateColor: ",this.BoxColor)
                console.log("uppdaterar färg: ",col)
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