<template>
    <div class="headlight" :class="{
        left: direction=='left',
        right: direction=='right'
    }">
    </div>
</template>
<script>
export default{
        name:'HalfCircle',
        props:{
            direction:String
        },
}
</script>
<style>
.headlight{
    width: 35%;
    height: 5%;
    background: linear-gradient(black,#545454,black);
    position: absolute;
    z-index:3;
    top:-19%;
}
.left{
    left:-5%;
    transform: rotate(45deg);
    filter: drop-shadow(400px 0 80px rgb(250, 245, 181)) drop-shadow(270px 0 100px rgb(250, 245, 181));
}
.right{
    right:-5%;
    transform: rotate(-45deg);
    filter: drop-shadow(-400px 0 80px rgb(250, 245, 181)) drop-shadow(-270px 0 120px rgb(250, 245, 181));
}
</style>