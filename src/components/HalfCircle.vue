<template>
    <div class="half-circle" :class="{
        light: lightPedestal && questionActive
    }"></div>
</template>
<script>
export default {
    name: 'HalfCircle',
    props: {
        lightPedestal: Boolean,
        questionActive: Boolean
    },
}
</script>
<style>
.half-circle {
    height: 10%;
    width: 50%;
    margin: auto;
    border-radius: 50% 50% 0 0/100% 100% 0 0;
    position: relative;
    z-index: 4;
    background: radial-gradient(circle at bottom, #8f8f8f, #4f4f4f);

}

.light {
    background: lightyellow;
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.5), 0 0 20px rgba(255, 255, 255, 0.5), 0 0 30px rgba(255, 255, 255, 0.5), 0 0 40px rgba(255, 255, 255, 0.5);
}
</style>