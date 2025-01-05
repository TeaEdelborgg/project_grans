<template>
    <div id="speachBubbleContainer">
        <img src="/img/SpeachBubble.png" id="speachBubble">
        <div id="textContainer">
            <h1>{{uiLabels.readyBeforeQuestion}}</h1>
            <h2>
                {{ timeLeftBeforeQuestion }}
            </h2>
        </div>
    </div>
</template>
<script>
export default{
        name:'SpeakBubble',
        props:{
            timeLeftBeforeQuestion: Number,
            uiLabels: Object
        },
        data: function(){
            return{
                
            }
        },
        
}
</script>
<style scoped>
#speachBubbleContainer{
    position:fixed;
    z-index:3;
    width:60%;
    height: 60%;
    right:10%;
    top:0;
}
#speachBubble{
    width: 100%;
    height: auto;
    /*transform:translateX(100%);
    transition: transform 1s ease-in-out;*/
}
#textContainer{
    position:absolute;
    z-index:5;
    top: 50%; 
    left: 50%;
    transform: translate(-50%, -50%); 
    text-align: center;  
    /*transform:translateX(100%);
    transition: transform 1s ease-in-out;*/
}
#textContainer h1, h2{
    color:black;
}
</style>