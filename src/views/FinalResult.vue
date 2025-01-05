<template>
    <div id="background">
        <div id="scoreBoard" v-if="answeresSentIn"> <!--Gör sedan att winner är namnet, och losers är endast listan av namnen-->
            <div class="headlight" :style="{left:'-5%',top:'-10%', transform:'rotate(45deg)', filter:'drop-shadow(200px 0 40px rgb(250, 245, 181))'}"></div>
            <div class="headlight" :style="{right:'-5%',top:'-10%',transform:'rotate(-45deg)',filter:'drop-shadow(-200px 0 40px rgb(250, 245, 181))'}"></div>
            <div id="podiumContainer">
                <div v-for="(player,index) in winners" ><h2 :style="{bottom: index==0 || index==2 ? '-40%':'-10%'}">{{ player.information.name }}</h2></div> 
                <img src="/img/goldPodium.png" alt="">
            </div>
            <!--<div>
                <h1>{{uiLabels.winner}}</h1> <br>
                <p>1. {{ winner.information.name }}</p> <br>
            </div>-->
            <div>
                <p v-for="(player, index) in losers">{{ index + 4 }}. {{ player.information.name }}</p> <br>   
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
const socket = io(sessionStorage.getItem("dataServer")) 

export default {
    name: 'FinalResultView',
    components: {
    
    },
    data: function () {
        return {
            uiLabels: {},
            pollId:"",
            winners:[],
            losers:[],
            answeresSentIn:false
        }
    },
    created: function () {
        this.pollId = this.$route.params.id
        socket.on("sendScoreBoard", val=>{
            this.winners = val.slice(0,3)
            let temp = this.winners[0]
            this.winners[0] = this.winners[1]
            this.winners[1] = temp
            this.losers = val.slice(3,val.length)
            this.answeresSentIn=true
        })
        socket.on( "uiLabels", labels => this.uiLabels = labels );
        socket.emit( "joinPoll", this.pollId );
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
    width: 100vw;
    height: 100vh;
    background-color: #001F3F;
    background: linear-gradient(135deg, #0a0347, #3c298f); 
    position: fixed;
}
.headlight{
    width: 25%;
    height: 5%;
    background: linear-gradient(black,#545454,black);
    position: absolute;
}
#scoreBoard{
    height: 100%;
    width: 80%;
    margin: auto;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    flex-grow: 1;
    position: relative;
}
#scoreBoard h1,h2,p{
    color:black;
}
#homeButtom{
    width: 30%;
    cursor:pointer;
    background-color: rgb(255, 136, 0);
    border:none;
    border-radius: 10px; 
    color:black;
    height: 10%;
    box-shadow: 0 8px 5px rgba(0, 0, 0, 0.1); 
    transition: background-color 0.3s ease; 
    
}
#homeButtom:hover{
    background-color: rgb(227, 122, 1);
    box-shadow: 0 8px 6px rgba(0, 0, 0, 0.4);
    transform: scale(1.2); 
}
#podiumContainer{
    height: 60%;
    width: 100%;
    position: relative;
    margin-top:10%;
    display: grid;
    grid-template-columns: 20% 30% 20%;
    justify-content: center;
}
#podiumContainer img{
    width: auto;
    height: 70%;
    position: absolute;
    z-index: 3;
    object-fit: cover;
    left: 50%; 
    transform: translate(-50%); 
    bottom: 0;
    z-index:2;
}
#podiumContainer h2{
    color:white;
    z-index:5;
    position: relative;
}
#scoreBoard p,h1,h2{
    color:white;
}
</style>
