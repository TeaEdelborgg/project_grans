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
    poll.timer = {timeLeft:10,interval:null} // tror ej detta används
    poll.timerBeforeQuestion = {timeLeft:3, interval:null} // inte detta heller
    poll.allCorrectedAnswers = {} // eller detta
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
    this.polls[pollId].participants.push({userId: userId, information: {name: name, color: color, answers: [], correctedAnswers:[], in:true, coloredBoxes:[], time:0, lives:2, usedFiftyFifty:false, usedAskAudience:false}}) //lägg till liv, tid ect alltså allt som är samma till en början
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

Data.prototype.getOneParticipant = function(pollId, userId) {
  if (this.pollExists(pollId)) {
    const user = this.polls[pollId].participants.find(user => user.userId == userId)
    return user
  }
  return {}

}

Data.prototype.addQuestion = function(pollId, q) {
  if (this.pollExists(pollId)) {
    console.log("frågan: ",q);
    this.polls[pollId].questions.push(q);
  }
}

Data.prototype.updateQuestion = function (pollId, questionToUpdate) {
  if (this.pollExists(pollId)) {
    const poll = this.polls[pollId];
    console.log("frågan vi vill åt:", questionToUpdate );
    const newQuestion=questionToUpdate;
    const questionIndex = poll.questions.findIndex((q) => q.id === newQuestion.id); //hittar id för den fråga i poll som matchar den updaterade frågans id
    if (questionIndex !== -1) {
      poll.questions[questionIndex] = newQuestion; //om frågan hittas ersätts den av den updaterade frågan
    }
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
    var test={q:poll.questions[poll.currentQuestion].q, a:answers}
    return(test)
  }
  return {}
}

Data.prototype.getFiftyFifty = function(pollId, userId) {
  if (this.pollExists(pollId)) {
    const questionNumber = this.polls[pollId].currentQuestion
    const user = this.polls[pollId].participants.find(user => user.userId == userId)
    user.information.usedFiftyFifty = true
    const twoIncorrect = this.polls[pollId].questions[questionNumber].a.wrong.slice(1,3)
    console.log({answers: twoIncorrect, user: userId})
    return {answers: twoIncorrect, user: userId}
  }
}

Data.prototype.getAudienceAnswer = function(pollId, userId, usedFiftyFifty) {
  if (this.pollExists(pollId)) {
    const questionNumber = this.polls[pollId].currentQuestion
    const user = this.polls[pollId].participants.find(user => user.userId == userId)
    user.information.usedAskAudience = true
    let answer
    let random = Math.random()
    console.log('i getAudienceAnswer', random)
    if (random < 0.9) {
      answer = this.polls[pollId].questions[questionNumber].a.correct
    } else if (!usedFiftyFifty) {
      random = Math.floor(Math.random()*3)
      answer = this.polls[pollId].questions[questionNumber].a.wrong[random]
    } else {
      answer = this.polls[pollId].questions[questionNumber].a.wrong[0]
    }
    return {answer: answer, user: userId}
  }
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

Data.prototype.submitAnswer = function(pollId, questionNumber, answer, userId, timeLeft) {
  console.log('pollId: ', pollId, 'qNo: ', questionNumber, 'answer: ', answer, 'userId: ', userId, 'timeleft: ', timeLeft)
  if (this.pollExists(pollId)) {
    const user = this.polls[pollId].participants.find(user => user.userId == userId)
    console.log('user är: ', user)
    if (answer == null) {
      console.log('i submitanswer, om det crashar', user?.information.answers[questionNumber])
      user.information.answers[questionNumber] = ["-", 0] // denna verkar crasha ibland? tror det är om userId inte skickas med
    } else {
      user.information.answers[questionNumber] = [answer, timeLeft]
    }
    
    console.log(user.information.answers, 'lyckades i submit answer')
  }
}

Data.prototype.newCheckUserAnswer = function(pollId, qId, userId) {
  console.log('i nya checkuseranswer')
  if(this.pollExists(pollId)){
    const user = this.polls[pollId].participants.find(user=> user.userId ==userId)
    /*console.log('i nya, user är: ', user)
    console.log('hela svaret, svar + tid: ', user.information.answers[qId])
    console.log('svaret som skickas är: ', user.information.answers[qId][0])*/
    if(user.information.answers[qId][0]==null){
      user.information.answers[qId]=["-",0]
    }
    if (user.information.answers[qId][0] == this.polls[pollId].questions[qId].a.correct) {
      user.information.correctedAnswers[qId] = true
      user.information.time += user.information.answers[qId][1];
      console.log('svaret är korrekt')
    } else {
      if(user.information.lives>0){ 
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

Data.prototype.getQuestionAmount = function (pollId) {
  if(this.pollExists(pollId)){
    this.polls[pollId].questionAmount = this.polls[pollId].questions.length;
  }
}


Data.prototype.createBoxes = function(pollId){
  if(this.pollExists(pollId)){
    const poll = this.polls[pollId]
    const numberOfQuestions = poll.questionAmount
    console.log('i createBoxes: ', numberOfQuestions)
    for (let player of poll.participants){
      for (let n=0; n<numberOfQuestions;n++){
        player.information.coloredBoxes.push(false)
      }
    }
    for (let i=0; i<numberOfQuestions;i++){
      let value = Math.ceil((1000000/numberOfQuestions)*(i+1)/10000)*10000
      if(value>1000000){value=1000000}
      poll.moneyBoxes.push(value)
    }
    console.log("money levlar: ",poll.moneyBoxes)
  }
}
Data.prototype.setAnswersFalse = function(pollId){
  if(this.pollExists(pollId)){
    const users = this.polls[pollId].participants
    for(let user of users){
      user.information.answers = new Array(this.polls[pollId].questionAmount).fill([null, 0])
      //console.log("setFalse: ", user.information.answers)
    }
  }
}

Data.prototype.updateColoredBoxes = function(pollId){
  if(this.pollExists(pollId)){
    const poll = this.polls[pollId]
    for(let player of poll.participants){
      if(player.information.in){
        
        let answers = player.information.correctedAnswers
        
        for (let i=0;  i<answers.length;i++){
            player.information.coloredBoxes[i]=true
        }
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
    let amountQuestions = poll.questionAmount
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

Data.prototype.getCorrectAnswer = function(pollId, qId){
  if(this.pollExists(pollId)){
    return this.polls[pollId].questions[qId].a.correct
  }
  return ""
}

Data.prototype.clearParticipants = function(pollId){
  if(this.pollExists(pollId)){
    console.log('i data, participants är: ', this.polls[pollId].participants)
    this.polls[pollId].participants = []
    this.polls[pollId].currentQuestion = -1
  }
}

export { Data };