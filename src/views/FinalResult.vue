<template>
    {{scoreBoard}}
</template>

<script>
// @ is an alias to /src

import io from 'socket.io-client';
const socket = io("localhost:3000");

export default {
    name: 'FinalResultView',
    components: {
    
    },
    data: function () {
        return {
            pollId:"",
            scoreBoard:[]
        }
    },
    created: function () {
        this.pollId = this.$route.params.id

        //this.pollId = this.$route.params.id;
        socket.on("sendScoreBoard", val=>{
            this.scoreBoard=val
            console.log("tog emot scoreboard")
        })
        socket.on( "uiLabels", labels => this.uiLabels = labels );
    },
    mounted(){
        socket.emit('getScoreBoard', this.pollId)
        console.log("skickar efter scoreBoard")
    }
}

</script>

<style>


</style>
