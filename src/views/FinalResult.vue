<template>
    <div id="background">
        <div id="scoreBoard" v-if="answeresSentIn">
            <h1>The winner is..</h1> <br>
            <p>1. {{ winner.information.name }}</p> <br>
            <h2>The losers are..</h2><br>
            <p v-for="(player, index) in losers">{{ index + 2 }}. {{ player.information.name }}</p> <br>   
            <button id="homeButtom" @click="$router.push('/')">Return to home page</button> 
        </div>
    </div>
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
            scoreBoard:[],
            winner:"",
            losers:[],
            answeresSentIn:false
        }
    },
    created: function () {
        this.pollId = this.$route.params.id

        //this.pollId = this.$route.params.id;
        socket.on("sendScoreBoard", val=>{
            this.scoreBoard=val
            this.winner = val[0]
            console.log(this.winner)
            this.losers = val.slice(1,this.scoreBoard.length)
            console.log(this.losers)
            this.answeresSentIn=true
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
#background{
    width: 100vh;
    height: 100vh;
    background-color: #001F3F;
}
#scoreBoard{
    height: 70%;
    width: 80%;
    background-color: #FF851B;
    border-style: solid;
    border-width: 10px;
    margin: auto;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    flex-grow: 1;

}
#homeButtom{
    width: 100%;
    margin-bottom: 10px;
    cursor:pointer;
    background-color: #39A2DB;
    color:black;
    height: 10%;
}
#homeButtom:hover{
    background-color: #4b6ab8;
    color: white;
}

</style>
