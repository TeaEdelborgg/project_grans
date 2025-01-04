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
#shadow{
    display: inline-block;
    position: relative;
    border-radius: 50%;
    padding: 5%;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6);;
}
</style>