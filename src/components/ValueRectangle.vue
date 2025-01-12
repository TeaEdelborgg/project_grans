<template>
    <div class="border-rectangle">
      <div class="rectangle"><p>{{currentValue}}</p></div>
    </div>
</template>
<script>
export default{
        name:'ValueRectangle',
        props:{
            currentValue:Number
        },
}
</script>
<style scoped>
.rectangle{
  width: 100%;
  height: 100%;
  background: radial-gradient(#ffd467, #be9611);
  clip-path: polygon(15% 0%, 85% 0%, 100% 50%, 85% 100%, 15% 100%, 0% 50%);
  align-content: center;
  justify-content: center;
  position: relative;
}
.border-rectangle{
  clip-path: polygon(15% 0%, 85% 0%, 100% 50%, 85% 100%, 15% 100%, 0% 50%);
  border: 2px solid lightyellow;
  position: absolute;
  width: 30%;
  height: 30%;
  background-color: lightyellow;
  top: 0;  
  left: 50%; 
  transform: translate(-50%, -50%); 
  box-shadow: 0 0 5px lightyellow;
}
.rectangle p{
  position: absolute;
  color:black;
  margin:0;
  left:50%;
  transform: translate(-50%,-50%);
  font-weight: bold;
}

</style>