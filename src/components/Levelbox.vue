<template>
    <div class="levelbox" :style="{backgroundColor:boxColorChange? boxColor: '#7FDBFF', borderColor:boxColor}">
    </div>
</template>
<script>
    export default{
        name:'Levelbox',
        props:{
            boxColor: String,
            //borderColor:String, //onödigt
            boxColorChange:Boolean
        },
        data: function(){
            return{
                //boxColor: '#7FDBFF'
            }
        },
        
}
</script>
<style scoped>
.levelbox{
  flex: 1; 
  width: 100%;
  margin:5px 0;
  border-radius:10px;
  border-style:dashed;
}
</style>