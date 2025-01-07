<template>
    <div id="background">
        <div v-if="showNameWinners[1]" id="confetti">
            <img src="/img/confetti2.png" alt="">
        </div>
        
        <div id="scoreBoard" v-if="answeresSentIn"> <!--Gör sedan att winner är namnet, och losers är endast listan av namnen-->
            <div class="headlight" :style="{left:'-5%',top:'-15%', transform:'rotate(45deg)',filter:'drop-shadow(270px 0 80px rgb(250, 245, 181)) drop-shadow(270px 0 100px rgb(250, 245, 181))'}"></div>
            <!--<div class="lightParent">
                <div class="light" :style="{left:'15%',top:'-1%', transform:'rotate(-225deg)'}"></div>
            </div>-->
            <div class="headlight" :style="{right:'-5%',top:'-15%',transform:'rotate(-45deg)',filter:'drop-shadow(-270px 0 80px rgb(250, 245, 181)) drop-shadow(-270px 0 120px rgb(250, 245, 181))'}"></div>
            <div id="podiumContainer">
                <div v-for="(player,index) in winners">
                    <h3 v-if="showNameWinners[index] && player!=null" :style="{
                    bottom: index==0 || index==2 ? '-52%':'-30%'}">
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
            totalWinners:0
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
            this.showNames()
        })
        socket.on( "uiLabels", labels => this.uiLabels = labels );
        socket.emit( "joinPoll", this.pollId );
        socket.emit( "getUILabels", this.lang );
    },
    mounted(){
        socket.emit('getScoreBoard', this.pollId)
        
        /*this.showNames(0)
        this.showNames(1)
        this.showNames(2)
        this.showNames(3)*/
    },
    methods:{
        showNames: function(){
            this.totalWinners = this.winners.filter(item => item!=null).length
            console.log("antalet winners: ", this.totalWinners)
            for(let i =this.totalWinners;i>0;i--){
                console.log("i for loop")
                let time = (this.totalWinners-i+1)*2000
                let index = this.totalWinners-i
                this.showNamesCountDown(index,time)
            //tar index*tiden som totala tiden, sen skicka index för vilken plats
        }
        this.showNamesCountDown(this.totalWinners, this.totalWinners+2*2000)
        },
        showNamesCountDown: function(index,time){
            /*let time = 0;
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
            }*/
            setTimeout(()=>{
                console.log("tid uppe")
                if(index<this.totalWinners){
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
#confetti img{
    width: 100%;
    height: auto;
    object-fit: contain;
    background-repeat: repeat-x;
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
    width: 35%;
    height: 5%;
    background: linear-gradient(black,#545454,black);
    position: absolute;
    z-index:3;
}
.light{
    clip-path: polygon(0% 0%, 50% 100%, 100% 0%);
    width: 80%;
    /*background: linear-gradient(to right, transparent 0%, transparent 40%, lightyellow 40%, lightyellow 60%,transparent 60%, transparent 100%); /*rgb(250, 245, 181);*/
    background: linear-gradient(to right, transparent 0, transparent 10%, lightyellow 40%, lightyellow 60%, transparent 90%, transparent 100%);
    height: 95%;
    z-index: 2;
    opacity: 0.7;
    /*mask-image: radial-gradient(circle,black 20%, transparent 100%);
    mask-size: 100% 100%;
    mask-repeat: no-repeat;*/
}
.lightParent{
    /*filter: drop-shadow(10%,10%,10%,red);*/
    filter: drop-shadow(0 0 60px rgb(250, 245, 181)) drop-shadow(0 0 80px rgb(250, 245, 181));
    overflow: visible;
    width: 40%;
    height: 80%;
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
    height: 60%;
    width: 65%;
    position: relative;
    margin-top:5%;
    display: grid;
    grid-template-columns: 18% 28% 18%;
    justify-content: center;
    text-align: center;
}
#podiumContainer img{
    width: 80%;
    height: auto;
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
    width: 40%;
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
