<template>
    <div id="background">
        <div id="board">
            <div v-if="winner">
                <h1>{{uiLabels.congratsWon}}</h1>
            </div>
            <div v-if="!winner">
                <h1>{{uiLabels.betterLuck}}<span class="dots"></span></h1>
            </div>
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
<style scoped>
h1 {
  font-family: 'Copperplate Gothic', 'Copperplate', serif;
  font-size: 80px;
  margin-top: 60px;
  color: #cfcfcf;
  text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 5px 0 #00000087;
}
.dots::after {
  content: "";
  display: inline-block;
  animation: dots 2s steps(3, end) infinite;
}

@keyframes dots {
  0% {
    content: "";
  }
  33% {
    content: ".";
  }
  66% {
    content: "..";
  }
  100% {
    content: "...";
  }
}

#background{
    display: block;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    width: 100vw;
    background: linear-gradient(135deg, #0a0347, #3c298f);
    background-attachment: fixed;
    background-size: cover;
    overflow: hidden;
    margin: 0;
    padding: 0;
    text-align: center;
    box-sizing: border-box;
}
#board{
    text-align: center;
    padding: 20px;
    background: linear-gradient(135deg, #1e0880,  #06012e); 
    border-radius: 10px;
    width: 90%;
    height: 200px;
    margin: 60px auto;
    margin-top: 130px;
    margin-bottom: 35px;
    box-shadow: 0 0 10px #f5f5f0c1, 0 0 20px #f5f5f0c1, 0 0 30px #f5f5f0c1;
    border: 1px solid #f5f5f0c1; 
}
@media (max-width: 480px) {
  h1 {
    font-size: 150%;
    margin-top: 0%;
    padding-top:30%;
  }
  #board {
    margin-top: 55%;
    width: 55%;
    margin-left: 60px;
    padding: none;
  }
}
</style>