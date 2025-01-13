<template>
    <div class="popup-end-game-content loading-dots">
        {{ uiLabels.redirectHomePage }}
        <div class="animated-dots"></div>
        <div class="animated-dots"></div>
        <div class="animated-dots"></div>
    </div>
</template>

<script>
export default {
    name: 'EndingMessage', 
    props: {
        uiLabels: Object,
    }
}
</script>