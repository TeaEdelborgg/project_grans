<template>
    <div id="speach-bubble-container">
        <img src="/img/SpeachBubble.png" id="speach-bubble">
        <div id="text-container">
            <h1>{{ uiLabels.readyBeforeQuestion }}</h1>
            <h2>
                {{ timeLeftBeforeQuestion }}
            </h2>
        </div>
    </div>
</template>
<script>
export default {
    name: 'SpeakBubble',
    props: {
        timeLeftBeforeQuestion: Number,
        uiLabels: Object
    },
}
</script>
<style scoped>
#speach-bubble-container {
    position: fixed;
    z-index: 3;
    width: 40%;
    height: 40%;
    right: 10%;
    top: 0;
}

#speach-bubble {
    width: 100%;
    height: auto;
    object-fit: contain;
}

#text-container {
    position: absolute;
    z-index: 5;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
}

#text-container h1,
h2 {
    color: black;
}
</style>