<template>
    <div id="background">
        <div id="scoreBoard" v-if="answeresSentIn">
            <div>
                <h1>{{uiLabels.winner}}</h1> <br>
                <p>1. {{ winner.information.name }}</p> <br>
            </div>
            <div>
                <h2>{{uiLabels.losers}}</h2><br>
                <p v-for="(player, index) in losers">{{ index + 2 }}. {{ player.information.name }}</p> <br>   
            </div>
            <button id="homeButtom" @click="$router.push('/')">
                <h3>{{uiLabels.returnHomeButton}}</h3>
            </button> 
        </div>
    </div>
</template>

<script>
// @ is an alias to /src

import io from 'socket.io-client';
//const socket = io("localhost:3000");
const socket = io(sessionStorage.getItem("dataServer")) //for mobile phones osv

export default {
    name: 'FinalResultView',
    components: {
    
    },
    data: function () {
        return {
            uiLabels: {},
            pollId:"",
            winner:"",
            losers:[],
            answeresSentIn:false
        }
    },
    created: function () {
        this.pollId = this.$route.params.id

        //this.pollId = this.$route.params.id;
        socket.on("sendScoreBoard", val=>{
            this.winner = val[0]
            this.losers = val.slice(1,val.length)
            this.answeresSentIn=true
        })
        socket.on( "uiLabels", labels => this.uiLabels = labels );
        socket.emit( "getUILabels", this.lang );
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
    justify-content: space-between;
    flex-grow: 1;
}
#homeButtom{
    width: 100%;
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
