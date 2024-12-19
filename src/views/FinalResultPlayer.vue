<template>
    <div id="background">
        <div id="board">
            <div v-if="winner">
                <h1>{{uiLabels.congratsWon}}</h1>
            </div>
            <div v-if="!winner">
                <h1>{{uiLabels.betterLuck}}</h1>
            </div>
            <button id="homeButtom" @click="$router.push('/')">
                <h3>{{uiLabels.returnHomeButton}}</h3>
            </button> 
        </div>
    </div>
</template>

<script>
import io from 'socket.io-client';
//const socket = io("localhost:3000");
const socket = io(sessionStorage.getItem("dataServer")) //for mobile phones osv

export default {
    name: 'FinalResultPlayerView',
    components: {
    
    },
    data: function () {
        return {
            uiLabels: {},
            winner:false,
            place:0
        }
    },
    created: function () {
        this.pollId = this.$route.params.id
        this.userId = this.$route.params.userId;

        socket.on('sendScoreBoard',scoreBoard=>{
            console.log("tog emot scoreBoard i player")
            this.findPlayerPlace(scoreBoard);  
        })
        
        //socket on den som skickar tillbaka scores
        socket.on( "uiLabels", labels => this.uiLabels = labels );
        socket.emit( "joinPoll", this.pollId );
        socket.emit( "getUILabels", this.lang );

    },
    mounted(){
        socket.emit('getScoreBoard', this.pollId) //måste kanske ha om sidorna inte hinner laddas in i tid, annars låt den andra sidan skicka till andra
        this.windowHeight = document.documentElement.clientHeight
        this.windowWidth = document.documentElement.clientWidth;
        const backgroundPlayer = document.getElementById('background');
        backgroundPlayer.style.width=this.windowWidth +"px";
        backgroundPlayer.style.height=this.windowHeight + "px";
    },
    methods:{
        //gör metod för att räkna ut platsen
        findPlayerPlace: function(scoreBoard){
            console.log("scoreboard: ",scoreBoard)
            const index = scoreBoard.findIndex(player => player.userId == this.userId)
            if(index==0){
                this.winner=true
            }
            else{
                this.place=index+1
            }
            /*for(let i=0;i<scoreBoard.length;i++){
                let player = scoreBoard[i]
                if(player.userId==this.userId){
                    if(i==0){
                        this.winner=true
                    }
                    this.place=i+1
                }
            }*/
        }
    }
}
</script>
<style>
#background{
    width: 100vh;
    height: 100vh;
    background-color: #001F3F;
}
#board{
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
    color:black;
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