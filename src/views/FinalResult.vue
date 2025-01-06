<template>
    <div id="background">
        <div v-if="showNameWinners[1]" id="confetti">
            <img src="/img/confetti.png" alt="">
        </div>
        
        <div id="scoreBoard" v-if="answeresSentIn"> <!--Gör sedan att winner är namnet, och losers är endast listan av namnen-->
            <div class="headlight" :style="{left:'-5%',top:'-10%', transform:'rotate(45deg)', filter:'drop-shadow(260px 0 60px rgb(250, 245, 181))'}"></div>
            <div class="headlight" :style="{right:'-5%',top:'-10%',transform:'rotate(-45deg)',filter:'drop-shadow(-260px 0 60px rgb(250, 245, 181))'}"></div>
            <div id="podiumContainer">
                <div v-for="(player,index) in winners">
                    <h3 v-if="showNameWinners[index]" :style="{
                    bottom: index==0 || index==2 ? '-50%':'-30%'}">
                    {{ player.information.name }}</h3></div> 
                <img src="/img/goldPodium.png" alt="">
            </div>
            <!--<div>
                <h1>{{uiLabels.winner}}</h1> <br>
                <p>1. {{ winner.information.name }}</p> <br>
            </div>-->
            <div id="losercontainer">
                <p v-for="(player, index) in losers" v-if="showNameLosers"> <span>{{ index + 4 }}.</span> {{ player.information.name }}</p> <br>   
            </div>
            <!--<button id="homeButtom" @click="$router.push('/')">
                <h3>{{uiLabels.returnHomeButton}}</h3>
            </button> -->
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
            answeresSentIn:false,
            showNameLosers:false,
            showNameWinners:[],
        }
    },
    created: function () {
        this.pollId = this.$route.params.id
        socket.on("sendScoreBoard", val=>{
            this.winners = val.slice(0,3)
            this.showNameWinners= new Array(this.winners.length).fill(false)
            console.log(this.showNameWinners)

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
        this.showNames(0)
        this.showNames(1)
        this.showNames(2)
        this.showNames(3)
    },
    methods:{
        showNames: function(index){
            let time = 0;
            if(index==0){
                time = (index+2)*2000
            }
            else if(index==1){
                time = (index+2)*2000
            }
            else if(index==2){
                time= (index-1)*2000
            }
            else{
                time = (index+1)*2000
            }
            setTimeout(()=>{
                console.log("tid uppe")
                if(index<=2){
                    this.showNameWinners[index]=true
                }
                else{
                    this.showNameLosers=true;
                }
            },time)
        }
    }
}

</script>

<style>
#confetti{
    position: absolute;
    z-index:0;
    height: auto;
    width: 100%;
    animation: fallingconfetti 10s forwards;
    overflow: hidden;
}
@keyframes fallingconfetti {
    0%{
        top:-150%;
    }
    100%{
        top:200%;
        opacity: 0.5;
    }
}
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
    z-index:2;
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
    height: 50%;
    width: 65%;
    position: relative;
    margin-top:10%;
    display: grid;
    grid-template-columns: 10% 30% 10%;
    justify-content: center;
}
#podiumContainer img{
    width: auto;
    height: 60%;
    position: absolute;
    z-index: 3;
    object-fit: cover;
    left: 50%; 
    transform: translate(-50%); 
    bottom: 0;
    z-index:2;
}
#podiumContainer h3{
    color:white;
    z-index:5;
    position: relative;
    animation: showsText 0.5s;
}
@keyframes showsText {
    0%{
        opacity: 0;
    }
    100%{
        opacity: 1;
    }
}
#scoreBoard p,h1,h2{
    color:white;
    animation: showsText 1s;
}
button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  position: absolute;
  left: 2px;
  top: 9px
}

button img {
  width: 140px; 
  height: auto;
}
#losercontainer{
    flex:1;
    width: 60%;
    margin-top: 5%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 2;
}
#losercontainer p{
    box-shadow: 0 0 20px lightyellow;
    height: 20%;
    width: 100%;
    margin: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    z-index: 2;

}
#losercontainer span{
    position: absolute;
    left:5%;
}
</style>
