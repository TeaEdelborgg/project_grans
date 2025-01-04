<template>
    <div v-if="!questionActive" class="test">
            <img src="/img/gubbe2.png" alt="">
            <div id="shadow"></div>
    </div>
    <div v-if="questionActive" class="test">
        <img src="/img/gubbe1.png" alt="" >
        <div id="shadow"></div>
    </div>
</template>
<script>
export default{
        name:'HostPlayer',
        props:{
            questionActive: Boolean
        },
        data: function(){
            return{
                
            }
        },
        
}
</script>
<style>
.test{
  position: relative;
  width: 20%;
  height: auto;
  bottom: -10%;
}

.test img{
    position:absolute;
    bottom: 5%;
    left:30%;
    transform: translateX(-50%);
    width: auto;
    height: 70%;
    object-fit: contain;
    z-index: 3;
    object-fit: cover;
    left: 50%; 
    transform: translate(-50%); 
}
#shadow{
    position: absolute;
    bottom: 0;
    width: 70%;
    height: 10%;
    z-index: 2;
    border-radius: 50%;
    background-color: black;
    opacity: 0.3;
    box-shadow: 0 0 30px  rgb(0, 0, 0.3), 0 0 30px  rgb(0, 0, 0.5), 0 0 30px  rgb(0, 0, 0.7),  0 0 30px  rgb(0, 0, 0.9);
    left: 50%; 
    transform: translate(-50%); 
}
</style>