<template>
    <div id="background">
        <div id="board">
            <div v-if="winner">
                <h1>Congrats you won</h1>
            </div>
            <div v-if="!winner">
                <h1>Better luck next time</h1>
            </div>
            <button id="homeButtom" @click="$router.push('/')">Return to home page</button> 
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
            winner:false,
            place:0
        }
    },
    created: function () {
        this.pollId = this.$route.params.id
        this.userId = this.$route.params.userId;

        socket.on('scoreBoardUser',scoreBoard=>{
            this.findPlayerPlace(scoreBoard);
            console.log("tog emot scoreBoard i player")
        })
        
        //socket on den som skickar tillbaka scores
        socket.on( "uiLabels", labels => this.uiLabels = labels );
    },
    mounted(){
        socket.emit('getScoreBoardUser', this.pollId) //byt ut till den andra
        console.log("skickar efter scoreBoard")
        this.windowHeight = document.documentElement.clientHeight
        this.windowWidth = document.documentElement.clientWidth;
        const backgroundPlayer = document.getElementById('background');
        backgroundPlayer.style.width=this.windowWidth +"px";
        backgroundPlayer.style.height=this.windowHeight + "px";
    },
    methods:{
        //gör metod för att räkna ut platsen
        findPlayerPlace: function(scoreBoard){
            for(let i=0;i<scoreBoard.length;i++){
                let player = scoreBoard[i]
                if(player.userId==this.userId){
                    if(i==0){
                        this.winner=true
                    }
                    this.place=i+1
                }
            }
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