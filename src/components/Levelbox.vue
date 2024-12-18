<template>
    <div class="levelbox" :style="{backgroundColor:borderColorChange? boxColor: '#7FDBFF', borderColor:borderColor}">
    </div>
    
</template>
<script>
    export default{
        name:'Levelbox',
        props:{
            boxColor: String,
            borderColor:String, 
            borderColorChange:Boolean
        },
        data: function(){
            return{
                //boxColor: '#7FDBFF'
            }
        },
        
}
</script>
<style scoped>

</style>