<template>
    <div v-if="!questionActive" class="test">
        <img src="/img/gubbe2.png" alt="">
    </div>
    <div v-if="questionActive" class="test">
        <img src="/img/gubbe1.png" alt="" >
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
#normalHost{
    width: auto;
    height: 70%;
    object-fit: contain;
}
#activeHost{
    position: relative;
}
.test{
  position: relative;
  width: 10%;
  height: auto;
  bottom: -10%;
}

.test img{
    position:absolute;
    bottom: 0;
    left:30%;
    transform: translateX(-50%);
    width: auto;
    height: 70%;
    object-fit: contain;
    z-index: 3;
}
</style>