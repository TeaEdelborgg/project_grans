'use strict';
import {readFileSync} from "fs";
import { createRequire } from 'module';

//import {quiz1} from "./quiz1.json" assert{type:'json';
//import {quiz1} from 'server\quiz1.json';


const require = createRequire(import.meta.url);
const quizes = require('./quizes.json');


// Store data in an object to keep the global namespace clean. In an actual implementation this would be interfacing a database...
function Data() {
  this.polls = {};
  this.polls['quiz1']= quizes.quiz1;
  this.polls['quiz2']= quizes.quiz2;
  this.polls['test'] = {
    lang: "sv",
    questions: [
      {q: "Hur långt är ett civilingenjörsprogram?", 
       a: { "correct": "5 år", "wrong": [ "3 år", "6 år", "4 år" ] }
      },
      {q: "Vad är Sveriges sjätte största stad?", 
       a: { "correct": "Västerås", wrong: ['Uppsala', 'Linköping', 'Helsingborg']}
      }, 
      {q: "Vad heter huvudstaden i Frankrike?", 
        a: { "correct": "Paris", wrong: ['London', 'Stockholm', 'Oslo']}
       },
       {q: "Hur många invånare finns i Sverige?", 
        a: { "correct": "10 miljoner", wrong: ['9 miljoner', '5 miljoner', '15 miljoner']}
       },
    ],
    answers: [], 
    currentQuestion: -1, 
    participants: []
  }
}
/***********************************************
For performance reasons, methods are added to the
prototype of the Data object/class
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures
***********************************************/

Data.prototype.pollExists = function (pollId) {
  return typeof this.polls[pollId] !== "undefined"
}

Data.prototype.getUILabels = function (lang) {
  //check if lang is valid before trying to load the dictionary file
  if (!["en", "sv"].some( el => el === lang))
    lang = "en";
  const labels = readFileSync("./server/data/labels-" + lang + ".json");
  return JSON.parse(labels);
}

Data.prototype.createPoll = function(pollId, lang="en") {
  if (!this.pollExists(pollId)) {
    let poll = {};
    poll.lang = lang;  
    poll.questions = [];
    poll.answers = [];
    poll.questionAmount = 0;
    poll.participants = [];
    poll.currentQuestion = -1; //var innan 0
    poll.timer = {timeLeft:10,interval:null} 
    poll.timerBeforeQuestion = {timeLeft:3, interval:null}    
    poll.allCorrectedAnswers = {}   
    poll.moneyBoxes = []; 
    poll.started = false;  
    poll.scoreBoard = []; 
    this.polls[pollId] = poll;
    console.log("poll created", pollId, poll);
  }
  return this.polls[pollId];
}

Data.prototype.getPoll = function(pollId) {
  if (this.pollExists(pollId)) {
    return this.polls[pollId];
  }
  return {};
}

Data.prototype.hasPollStarted = function(pollId) {
  if (this.pollExists(pollId)) {
    return this.polls[pollId].started;
  }
  return false;
}

Data.prototype.participateInPoll = function(pollId, name, userId, color) {
  console.log("participant will be added to", pollId, name, userId, color);
  if (this.pollExists(pollId)) {
    this.polls[pollId].participants.push({userId: userId, information: {name: name, color: color, answers: [], correctedAnswers:[], in:true, coloredBoxes:[], time:0, lives:2}}) //lägg till liv, tid ect alltså allt som är samma till en början
  }
}

Data.prototype.updateColorSelection = function (info) {
  const {pollId, color, userId} = info;
  if (this.pollExists(pollId)) {
    const poll = this.getPoll(pollId);
    const participant = poll.participants.find((p) => p.userId === userId);
    if (participant) {
      participant.information.color = color;
    }
    return poll.participants;
  }
  return [];
}

Data.prototype.getParticipants = function(pollId) {
  const poll = this.polls[pollId];
  console.log("participants requested for", pollId);
  if (this.pollExists(pollId)) { 
    return this.polls[pollId].participants
  }
  return [];
}

Data.prototype.addQuestion = function(pollId, q) {
  if (this.pollExists(pollId)) {
    console.log("frågan: ",q);
    this.polls[pollId].questions.push(q);
  }
}

Data.prototype.getQuestion = function(pollId, qId = null) { //borde gå att göra om, vill ha den nedanför istället
  if (this.pollExists(pollId)) {
    const poll = this.polls[pollId];
    if (qId !== null) {
      poll.currentQuestion = qId;
    }
    return poll.questions[poll.currentQuestion];
  }
  return {}
}

Data.prototype.getQuestionAnswerRandom = function(pollId, qId = null) {
  if (this.pollExists(pollId)) {
    const poll = this.polls[pollId];
    if (qId !== null) {
      poll.currentQuestion = qId;
    }
    let answers = ['','','','']
    let currentQuest = poll.questions[poll.currentQuestion];
    let avalibleSlots = [0,1,2,3];
    var index = Math.floor(Math.random()*4);
    answers[index] = currentQuest.a.correct;
    avalibleSlots.splice(index,1);
    for(const wrongAnsw of currentQuest.a.wrong){
      index=Math.floor(Math.random()*avalibleSlots.length);
      answers[avalibleSlots[index]]=wrongAnsw;
      avalibleSlots.splice(index,1);
    };
    //return poll.questions[poll.currentQuestion];
    //var test={q:poll.questions[poll.currentQuestion].q, a:{correct:"",wrong:answers}}
    var test={q:poll.questions[poll.currentQuestion].q, a:answers, correct:currentQuest.a.correct}
    return(test)
  }
  return {}
}

Data.prototype.getSubmittedAnswers = function(pollId) { //behövs den här??? Vi borde kunna skriva om våra sockets mycket
  if (this.pollExists(pollId)) {
    const poll = this.polls[pollId];
    const answers = poll.answers[poll.currentQuestion];
    if (typeof poll.questions[poll.currentQuestion] !== 'undefined') {
      return answers;
    }
  }
  return {}
}

/*Data.prototype.checkUserAnswer = function(pollId, qId=null, userId){ //dela upp funktionen, borde inte behöva skicka qId, finns redan
  console.log("i data checkUserAnswer, vill plocka bort denna")
  if(this.pollExists(pollId)){
    const poll = this.polls[pollId];
    const user = poll.participants.find(user=> user.userId ==userId);
    if(qId !=null){
      if(user){
        if(user.information.answers[qId]==null){
            user.information.answers[qId]=["-",0]
        }
        if (user.information.correctedAnswers[qId]==null){
          if(user.information.answers[qId][0]==poll.questions[qId].a.correct){ //ta bort -1 sen, är bara för att de inte skickar randomOrder på första
              //lägg till tiden för användaren
              user.information.correctedAnswers[qId] =true
              user.information.time += user.information.answers[qId][1];
              return true;
          }
          else{
            if(user.information.lives>0){
                user.information.lives--;
                //console.log(user.information.lives)
            }
              user.information.correctedAnswers[qId] = false
              return false;
          }
        }   
      }
    }
  }
  return null
}*/

/*Data.prototype.testCheckAnswers = function(pollId,qId=null){
    if(this.pollExists(pollId)){
      const users = this.polls[pollId].participants
      for(let user of users){
        let ans = this.checkUserAnswer(pollId,qId,user.userId)
        console.log('i testCheckAnswers, svaret är: ', ans)
      }
    }
}*/

Data.prototype.submitAnswer = function(pollId, questionNumber, answer, userId, timeLeft) {
  if (this.pollExists(pollId)) {
    const user = this.polls[pollId].participants.find(user => user.userId == userId)
    user.information.answers[questionNumber]= [answer, timeLeft]
    console.log(user.information.answers, 'lyckades i submit answer')
    
    /*const poll = this.polls[pollId];
    const users = poll.participants;
    for (const key in users) {
      const user = users[key]
      if (userId==user.userId) {
        user.information.answers[questionNumber]= [answer, timeLeft]
        console.log(user.information.answers, 'lyckades i submit answer')
      }
    }*/
  }
}

Data.prototype.newCheckUserAnswer = function(pollId, qId, userId) {
  console.log('i nya checkuseranswer')
  if(this.pollExists(pollId)){
    const user = this.polls[pollId].participants.find(user=> user.userId ==userId)
    /*console.log('i nya, user är: ', user)
    console.log('hela svaret, svar + tid: ', user.information.answers[qId])
    console.log('svaret som skickas är: ', user.information.answers[qId][0])*/
    /*if(user.information.answers[qId]==null){ // måste man ha detta här? det funkar för det första svaret om man ej skickar något??
      user.information.answers[qId]=["-",0]
    }*/
    if (user.information.answers[qId][0] == this.polls[pollId].questions[qId].a.correct) {
      user.information.correctedAnswers[qId] = true
      user.information.time += user.information.answers[qId][1];
      console.log('svaret är korrekt')
    } else {
      if(user.information.lives>0){ // måste fixa vad som händer om liven är 0
        user.information.lives--;
      }
      user.information.correctedAnswers[qId] = false
      console.log('svaret är fel')
    }
  }
};

Data.prototype.getCorrectedAnswer = function (pollId, qId, userId) {
  console.log('i data getCorrectedAnswer')
  if(this.pollExists(pollId)){
    const user = this.polls[pollId].participants.find(user=> user.userId == userId)
    if (user) {
      console.log('har svarat rätt: ', user.information.correctedAnswers[qId])
      return user.information.correctedAnswers[qId];
    }
  }
  return null;
};

Data.prototype.updateQuestion = function (pollId,question){
  if(this.pollExists(pollId)){
    //i question borde question.id finnas, question är undefined
    console.log(question)
    const poll = this.polls[pollId]
    const questionIndex = poll.questions.findIndex(q =>q.q ===question.q);
    if(questionIndex ===-1){
      return null
    }
    poll.questions[questionIndex] = question;
    return question;
  }
  return null
}

Data.prototype.getQuestionAmount = function (pollId) {
  if(this.pollExists(pollId)){
    this.questionAmount = this.polls[pollId].questions.length;
  }
}

Data.prototype.amountOfQuestions = function (pollId){
  if(this.pollExists(pollId)){
    return this.polls[pollId].questions.length;
  }
}
Data.prototype.createBoxes = function(pollId){
  if(this.pollExists(pollId)){
    const poll = this.polls[pollId]
    const numberOfQuestions = this.amountOfQuestions(pollId)
    for (let player of poll.participants){
      for (let n=0; n<numberOfQuestions;n++){
        player.information.coloredBoxes.push(false)
      }
    }
    //fixa pengar levlar här
    for (let i=0; i<numberOfQuestions;i++){
      let value = Math.ceil((1000000/numberOfQuestions)*(i+1)/10000)*10000//Math.ceil((1000000/numberOfQuestions)*(i+1)) //här ska det endast vara två decimaler
      poll.moneyBoxes.push(value)
    }
    console.log("money levlar: ",poll.moneyBoxes)
  }
}
Data.prototype.setAnswersFalse = function(pollId){
  if(this.pollExists(pollId)){
    const users = this.polls[pollId].participants
    for(let user of users){
      user.information.answers = new Array(this.amountOfQuestions(pollId)).fill(null)
      console.log("setFalse: ", user.information.answers)
    }
  }
}

Data.prototype.updateColoredBoxes = function(pollId){
  if(this.pollExists(pollId)){
    const poll = this.polls[pollId]
    for(let player of poll.participants){
      if(player.information.in){
        //console.log(player.information.name, " svar: ",player.information.answers)
        //console.log(player.information.name, " corrected Answeres: ",player.information.correctedAnswers)
        //console.log(player.information.name, " coloredBoxes: ",player.information.coloredBoxes)
        
        let answers = player.information.correctedAnswers
        
        for (let i=0;  i<answers.length;i++){
            player.information.coloredBoxes[i]=true
          
          /*else{
            player.information.coloredBoxes[i]=false
          }*/
        }
        //console.log("uppdaterar coloredBoxes: ",player.userId, " ", player.information.coloredBoxes)
        if(player.information.lives==0){
          player.information.in = false
        }
      }
    }
    return poll.participants
  }
  return {}
}

Data.prototype.updateLevelBoxes = function(pollId){
  if(this.pollExists(pollId)){
    const poll = this.polls[pollId]
    let current = poll.currentQuestion
    let amountQuestions = this.amountOfQuestions(pollId)
    let boxes =[]
    for(let i =0; i<amountQuestions; i++){
      if(i <=current){
        boxes.push("done")
      }
      else{
        if(i==(current+1)){
          boxes.push("next")
        }
        else{
          boxes.push("future")
        }
      }
    }
    //console.log("boxes i data: ",boxes)
    return boxes
  }
  return []
}
Data.prototype.getLevelValues = function(pollId){
  if(this.pollExists(pollId)){
    return this.polls[pollId].moneyBoxes
  }
}
Data.prototype.countScore = function(pollId){ //Selection sort
  var scoreBoard = Object.values(this.polls[pollId].participants)
  if(this.pollExists(pollId)){
    for(let i=0;i<scoreBoard.length;i++){
      let smallest =i
      for(let n=smallest+1;n<scoreBoard.length;n++){
        let playerOne=scoreBoard[smallest]
        let playerTwo=scoreBoard[n]
        let playerOnePoints = this.countPoints(playerOne)
        let playerTwoPoints = this.countPoints(playerTwo)
        if(playerOnePoints<playerTwoPoints){
          smallest = n
        }
        else if(playerOnePoints==playerTwoPoints){ //kan sätta ihop vissa av villkoren
          //titta liv o sen tid
          if(playerOne.information.lives<playerTwo.information.lives){
            smallest=n
          }
          else if(playerOne.information.lives == playerTwo.information.lives){
            if(playerOne.information.time<playerTwo.information.time){
              smallest=n
            }
          }
        }
      }
      let x = scoreBoard[i]
      scoreBoard[i] = scoreBoard[smallest]
      scoreBoard[smallest] = x
    }
    console.log(scoreBoard)
    this.polls[pollId].scoreBoard=scoreBoard
    return scoreBoard
  }
  return []
}
Data.prototype.countPoints = function(player){
  let scoreCard = player.information.coloredBoxes
  let points = 0
  for(let i=0; i<scoreCard.length;i++){
    if(scoreCard[i]==true){
      points++
    }
  }
  return points
}
Data.prototype.getScoreBoard = function(pollId){
  if(this.pollExists(pollId)){
    return this.polls[pollId].scoreBoard
  }
  return []
}
/*------------------------Gammal kod---------------------------------------- */
/*
Data.prototype.selectBox = function (info) {
  const { pollId, boxIndex, userId, label } = info;
  if(this.pollExists(pollId)){
  const poll = this.getPoll(pollId);
  if (!poll.participants||poll.participants.length === 0) {
    console.error("Participants not found");
    return null; // Returning null to indicate failure
  }

  const participant = poll.participants.find((p) => p.userId === userId);
  if (participant) {
    participant.selectedBox = boxIndex;
    participant.information.boxLabel = label;
  } else {
    console.error("Participant not found");
    return null;
  }

  const boxStates = poll.participants.map((p) => ({
    boxIndex: p.selectedBox,
    userId: p.userId,
    label: p.information.boxLabel || `Player ${p.userId}`,
  }));

  return boxStates; // Returning the updated box states for use in the socket file
}}*/

/*Data.prototype.startTimer = function(pollId, totalTime){
  //console.log("i start timer")
  if(this.pollExists(pollId)){
    //console.log("pollId existerar")
    const poll = this.polls[pollId];
    poll.timer.timeLeft = totalTime;
    poll.timer.interval = null;
    poll.timer.interval = setInterval(()=>{
      if( poll.timer.timeLeft > 0){
        poll.timer.timeLeft--;
        //console.log("tid kvar: ", poll.timer.timeLeft)
      } else {
        clearInterval(poll.timer.interval);
        poll.timer.timeLeft=0;
      }
    },1000);
  }
}*/

/*Data.prototype.startTimeBeforeQuestion = function (pollId, totalTime){
  console.log("i time före fråga")
  if(this.pollExists(pollId)){
    const poll = this.polls[pollId];
    poll.timerBeforeQuestion.timeLeft=totalTime;
    poll.timerBeforeQuestion.interval=null;
    poll.timerBeforeQuestion.interval = setInterval(()=>{
      if(poll.timerBeforeQuestion.timeLeft > 0){
        poll.timerBeforeQuestion.timeLeft--;
        //console.log("tid kvar innan fråga: ",poll.timerBeforeQuestion.timeLeft)
      } else{
        clearInterval(poll.timerBeforeQuestion.interval);
        poll.timerBeforeQuestion.timeLeft=0
      }
    },1000);
  }
}*/

/*Data.prototype.getTime = function(pollId){
  if(this.pollExists(pollId)){
    let time = this.polls[pollId].timer.timeLeft
    //console.log("tid i getTime: ",time)
    return time
  }
  return 0
}*/

/*Data.prototype.getTimeBeforeQuestion = function(pollId){
  if(this.pollExists(pollId)){
    let time = this.polls[pollId].timerBeforeQuestion.timeLeft
    //console.log("tiden i getTimeBeforeQuestion: ",time)
    return time
  }
  return 0
}*/

export { Data };




