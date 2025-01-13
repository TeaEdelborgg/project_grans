'use strict';
import {readFileSync} from "fs";
import { createRequire } from 'module';


const require = createRequire(import.meta.url);
const quizes = require('./quizes.json');


// Store data in an object to keep the global namespace clean. In an actual implementation this would be interfacing a database...
function Data() {
  this.quizs = {};
  this.quizs['quiz1En']= quizes.quiz1En;
  this.quizs['quiz1Sv']= quizes.quiz1Sv;
  this.quizs['quiz2En']= quizes.quiz2En;
  this.quizs['quiz2Sv']= quizes.quiz2Sv;
  this.quizs['quiz3En']= quizes.quiz3En;
  this.quizs['quiz3Sv']= quizes.quiz3Sv;
}
/***********************************************
For performance reasons, methods are added to the
prototype of the Data object/class
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures
***********************************************/

Data.prototype.quizExists = function (quizId) {
  return typeof this.quizs[quizId] !== "undefined"
}

Data.prototype.getUILabels = function (lang) {
  //check if lang is valid before trying to load the dictionary file
  if (!["en", "sv"].some( el => el === lang))
    lang = "en";
  const labels = readFileSync("./server/data/labels-" + lang + ".json");
  return JSON.parse(labels);
}

Data.prototype.createPoll = function(quizId, lang="en") {
  if (!this.quizExists(quizId)) {
    let quiz = {};
    quiz.lang = lang;  
    quiz.questions = [];
    quiz.answers = [];
    quiz.questionAmount = 0;
    quiz.heightSteps = 0;
    quiz.participants = [];
    quiz.currentQuestion = -1; 
    quiz.timer = {timerDuration: 23000, timerQuestion:20000, timerAnswers:15000, timeShowCorrectAnswer:2000};
    quiz.moneyBoxes = []; 
    quiz.started = false;  
    quiz.scoreBoard = []; 
    quiz.pedestalLight = [];
    this.quizs[quizId] = quiz;
  }
  return this.quizs[quizId];
}

Data.prototype.getPoll = function(quizId) {
  if (this.quizExists(quizId)) {
    return this.quizs[quizId];
  }
  return {};
}

Data.prototype.hasPollStarted = function(quizId) {
  if (this.quizExists(quizId)) {
    return this.quizs[quizId].started;
  }
  return false;
}

Data.prototype.participateInPoll = function(quizId, name, userId, color) {
  if (this.quizExists(quizId)) {
    this.quizs[quizId].participants.push({userId: userId, information: {name: name, color: color, answers: [], correctedAnswers:[], in:true, pillarBoxes:[], time:0, lives:2, usedFiftyFifty:false, usedAskAudience:false, pillarHeight:2}}) 
  }
}

Data.prototype.updateColorSelection = function (info) {
  const {quizId, color, userId} = info;
  if (this.quizExists(quizId)) {
    const quiz = this.getPoll(quizId);
    const participant = quiz.participants.find((p) => p.userId === userId);
    if (participant) {
      participant.information.color = color;
    }
    return quiz.participants;
  }
  return [];
}

Data.prototype.getParticipants = function(quizId) {
  const quiz = this.quizs[quizId];
  if (this.quizExists(quizId)) { 
    return this.quizs[quizId].participants
  }
  return [];
}

Data.prototype.getOneParticipant = function(quizId, userId) {
  if (this.quizExists(quizId)) {
    const user = this.quizs[quizId].participants.find(user => user.userId == userId)
    return user
  }
  return {}

}

Data.prototype.addQuestion = function(quizId, q) {
  if (this.quizExists(quizId)) {
    this.quizs[quizId].questions.push(q);
  }
}

Data.prototype.updateQuestion = function (quizId, questionToUpdate) {
  if (this.quizExists(quizId)) {
    const quiz = this.quizs[quizId];
    const newQuestion=questionToUpdate;
    const questionIndex = quiz.questions.findIndex((q) => q.id === newQuestion.id); 
    if (questionIndex !== -1) {
      quiz.questions[questionIndex] = newQuestion; 
    }
  }
}

Data.prototype.getQuestion = function(quizId, qId = null) { 
  if (this.quizExists(quizId)) {
    const quiz = this.quizs[quizId];
    if (qId !== null) {
      quiz.currentQuestion = qId;
    }
    return quiz.questions[quiz.currentQuestion];
  }
  return {}
}

Data.prototype.getAnswerRandomOrder = function(quizId, qId = null) {
  if (this.quizExists(quizId)) {
    const quiz = this.quizs[quizId];
    if (qId !== null) {
      quiz.currentQuestion = qId;
    }
    let answers = ['','','','']
    let currentQuest = quiz.questions[quiz.currentQuestion];
    let avalibleSlots = [0,1,2,3];
    var index = Math.floor(Math.random()*4);
    answers[index] = currentQuest.a.correct;
    avalibleSlots.splice(index,1);
    for(const wrongAnsw of currentQuest.a.wrong){
      index=Math.floor(Math.random()*avalibleSlots.length);
      answers[avalibleSlots[index]]=wrongAnsw;
      avalibleSlots.splice(index,1);
    };
    return({q:quiz.questions[quiz.currentQuestion].q, a:answers})
  }
  return {}
}

Data.prototype.getFiftyFifty = function(quizId, userId) {
  if (this.quizExists(quizId)) {
    const questionNumber = this.quizs[quizId].currentQuestion
    const user = this.quizs[quizId].participants.find(user => user.userId == userId)
    user.information.usedFiftyFifty = true
    const twoIncorrect = this.quizs[quizId].questions[questionNumber].a.wrong.slice(1,3)
    return {answers: twoIncorrect, user: userId}
  }
}

Data.prototype.getAudienceAnswer = function(quizId, userId, usedFiftyFifty) {
  if (this.quizExists(quizId)) {
    const questionNumber = this.quizs[quizId].currentQuestion
    const user = this.quizs[quizId].participants.find(user => user.userId == userId)
    user.information.usedAskAudience = true
    let answer
    let random = Math.random()
    if (random < 0.9) {
      answer = this.quizs[quizId].questions[questionNumber].a.correct
    } else if (!usedFiftyFifty) {
      random = Math.floor(Math.random()*3)
      answer = this.quizs[quizId].questions[questionNumber].a.wrong[random]
    } else {
      answer = this.quizs[quizId].questions[questionNumber].a.wrong[0]
    }
    return {answer: answer, user: userId}
  }
}

Data.prototype.getSubmittedAnswers = function(quizId) {
  if (this.quizExists(quizId)) {
    const quiz = this.quizs[quizId];
    const answers = quiz.answers[quiz.currentQuestion];
    if (typeof quiz.questions[quiz.currentQuestion] !== 'undefined') {
      return answers;
    }
  }
  return {}
}

Data.prototype.submitAnswer = function(quizId, questionNumber, answer, userId, timeLeft) {
  if (this.quizExists(quizId)) {
    const user = this.quizs[quizId].participants.find(user => user.userId == userId)
      user.information.answers[questionNumber] = [answer, timeLeft]
  }
}
Data.prototype.updatePedestalLight = function(quizId, userId){
  if(this.quizExists(quizId)){
    let particpants = this.quizs[quizId].participants
    let userIds = particpants.map((particpant)=>particpant.userId)
    let index= userIds.indexOf(Number(userId))
    this.quizs[quizId].pedestalLight[index] = true
    return this.quizs[quizId].pedestalLight
  }
  return []
}

Data.prototype.checkUserAnswer = function(quizId, qId, userId) {
  if(this.quizExists(quizId)){
    const user = this.quizs[quizId].participants.find(user=> user.userId ==userId)
    if(user.information.answers[qId][0]==null){
      user.information.answers[qId]=["-",0]
    }
    if (user.information.answers[qId][0] == this.quizs[quizId].questions[qId].a.correct) {
      user.information.correctedAnswers[qId] = true
      user.information.time += user.information.answers[qId][1];
    } else {
      if(user.information.lives>0){ 
        user.information.lives--;
      }
      user.information.correctedAnswers[qId] = false
    }
  }
};

Data.prototype.getCorrectedAnswer = function (quizId, qId, userId) {
  if(this.quizExists(quizId)){
    const user = this.quizs[quizId].participants.find(user=> user.userId == userId)
    if (user) {
      return user.information.correctedAnswers[qId];
    }
  }
  return null;
};

Data.prototype.setQuestionAmount = function (quizId) {
  if(this.quizExists(quizId)){
    this.quizs[quizId].questionAmount = this.quizs[quizId].questions.length;
    this.quizs[quizId].heightSteps = 100/this.quizs[quizId].questionAmount
  }
}

Data.prototype.createBoxes = function(quizId){
  if(this.quizExists(quizId)){
    const quiz = this.quizs[quizId]
    const numberOfQuestions = quiz.questionAmount
    for (let player of quiz.participants){
      for (let n=0; n<numberOfQuestions;n++){
        player.information.pillarBoxes.push(false)
      }
    }
    for (let i=0; i<numberOfQuestions;i++){
      let value = Math.ceil((1000000/numberOfQuestions)*(i+1)/10000)*10000
      if(value>1000000){value=1000000}
      quiz.moneyBoxes.push(value)
    }
  }
}
Data.prototype.setAnswersFalse = function(quizId){
  if(this.quizExists(quizId)){
    const users = this.quizs[quizId].participants
    for(let user of users){
      user.information.answers = new Array(this.quizs[quizId].questionAmount).fill([null, 0])
    }
  }
}

Data.prototype.setPedestalLightFalse = function(quizId){
  if(this.quizExists(quizId)){
      this.quizs[quizId].pedestalLight = new Array(this.quizs[quizId].participants.length).fill(false)
  }
}
Data.prototype.getPedestalLight = function(quizId){
  if(this.quizExists(quizId)){
    return this.quizs[quizId].pedestalLight
  }
}
Data.prototype.resetPedestalLight = function(quizId){
  if(this.quizExists(quizId)){
    this.quizs[quizId].pedestalLight=this.quizs[quizId].pedestalLight.map(()=>false)
    return this.quizs[quizId].pedestalLight
  }
}

Data.prototype.updatePillarHeight = function(quizId){
  if(this.quizExists(quizId)){
    const quiz = this.quizs[quizId]
    for(let player of quiz.participants){
      if(player.information.in){
        let answers = player.information.correctedAnswers
        for (let i=0;  i<answers.length;i++){
            player.information.pillarBoxes[i]=true
        }
        if(player.information.lives==0){
          player.information.in = false
        }
        const pillarTrue = player.information.pillarBoxes.filter(value => value===true).length;
        if(pillarTrue==0){
          player.information.pillarHeight=2
        }
          player.information.pillarHeight= quiz.heightSteps*pillarTrue
      }
    }
    return quiz.participants
  }
  return {}
}

Data.prototype.updateLevelBoxes = function(quizId){
  if(this.quizExists(quizId)){
    const quiz = this.quizs[quizId]
    let current = quiz.currentQuestion
    let amountQuestions = quiz.questionAmount
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
Data.prototype.getLevelValues = function(quizId){
  if(this.quizExists(quizId)){
    return this.quizs[quizId].moneyBoxes
  }
}
Data.prototype.countScore = function(quizId){ //Selection sort
  var scoreBoard = Object.values(this.quizs[quizId].participants)
  if(this.quizExists(quizId)){
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
        else if(playerOnePoints==playerTwoPoints){ 
          let bool =this.compareLivesAndTime(playerOne,playerTwo)
          if(bool){
            smallest=n
          }
        }
      }
      let x = scoreBoard[i]
      scoreBoard[i] = scoreBoard[smallest]
      scoreBoard[smallest] = x
    }
    this.quizs[quizId].scoreBoard=scoreBoard
    return scoreBoard
  }
  return []
}
Data.prototype.countPoints = function(player){
  let scoreCard = player.information.pillarBoxes
  let points = 0
  for(let i=0; i<scoreCard.length;i++){
    if(scoreCard[i]==true){
      points++
    }
  }
  return points
}
Data.prototype.compareLivesAndTime = function(playerOne, playerTwo){
  if(playerOne.information.lives<playerTwo.information.lives){
    return true
  }
  else if(playerOne.information.lives == playerTwo.information.lives){
    if(playerOne.information.time<playerTwo.information.time){
      return true
    }
  }
  return false
}
Data.prototype.getScoreBoard = function(quizId){
  if(this.quizExists(quizId)){
    return this.quizs[quizId].scoreBoard
  }
  return []
}

Data.prototype.getCorrectAnswer = function(quizId, qId){
  if(this.quizExists(quizId)){
    return this.quizs[quizId].questions[qId].a.correct
  }
  return ""
}

Data.prototype.clearParticipants = function(quizId){
  if(this.quizExists(quizId)){
    this.quizs[quizId].participants = []
    this.quizs[quizId].currentQuestion = -1
  }
}

Data.prototype.getTimer = function(quizId){
  if(this.quizExists(quizId)){
    return this.quizs[quizId].timer
  }
}

export { Data };