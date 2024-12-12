'use strict';
import {readFileSync} from "fs";

// Store data in an object to keep the global namespace clean. In an actual implementation this would be interfacing a database...
function Data() {
  this.polls = {};
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
    answers: [], //behöver egentligen inte
    currentQuestion: 0,
    participants: []
  }
}
//timern, fungerar med intervall
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
    poll.participants = [];
    poll.currentQuestion = 0; 
    poll.timer = {timeLeft:10,interval:null} 
    poll.timerBeforeQuestion = {timeLeft:3, interval:null}    
    poll.allCorrectedAnswers = {}       
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

Data.prototype.participateInPoll = function(pollId, name, userId) {
  console.log("participant will be added to", pollId, name, userId);
  if (this.pollExists(pollId)) {
    this.polls[pollId].participants.push({userId: userId, information: {name: name, answers: [], correctedAnswers:[], time:0, lives:2}}) //lägg till liv, tid ect alltså allt som är samma till en början
  }
}

Data.prototype.getParticipants = function(pollId) {
  const poll = this.polls[pollId];
  console.log("participants requested for", pollId);
  if (this.pollExists(pollId)) { 
    return this.polls[pollId].participants
  }
  return [];
}

Data.prototype.startTimer = function(pollId, totalTime){
  console.log("i start timer")
  if(this.pollExists(pollId)){
    console.log("pollId existerar")
    const poll = this.polls[pollId];
    poll.timer.timeLeft = totalTime;
    poll.timer.interval = null;
    poll.timer.interval = setInterval(()=>{
      if( poll.timer.timeLeft > 0){
        poll.timer.timeLeft--;
        console.log("tid kvar: ", poll.timer.timeLeft)
      } else {
        clearInterval(poll.timer.interval);
        poll.timer.timeLeft=0;
      }
    },1000);
  }
}

Data.prototype.startTimeBeforeQuestion = function (pollId, totalTime){
  console.log("i time före fråga")
  if(this.pollExists(pollId)){
    const poll = this.polls[pollId];
    poll.timerBeforeQuestion.timeLeft=totalTime;
    poll.timerBeforeQuestion.interval=null;
    poll.timerBeforeQuestion.interval = setInterval(()=>{
      if(poll.timerBeforeQuestion.timeLeft > 0){
        poll.timerBeforeQuestion.timeLeft--;
        console.log("tid kvar innan fråga: ",poll.timerBeforeQuestion.timeLeft)
      } else{
        clearInterval(poll.timerBeforeQuestion.interval);
        poll.timerBeforeQuestion.timeLeft=0
      }
    },1000);
  }
}

Data.prototype.getTime = function(pollId){
  if(this.pollExists(pollId)){
    let time = this.polls[pollId].timer.timeLeft
    console.log("tid i getTime: ",time)
    return time
  }
  return 0
}

Data.prototype.getTimeBeforeQuestion = function(pollId){
  if(this.pollExists(pollId)){
    let time = this.polls[pollId].timerBeforeQuestion.timeLeft
    console.log("tiden i getTimeBeforeQuestion: ",time)
    return time
  }
  return 0
}

Data.prototype.addQuestion = function(pollId, q) {
  if (this.pollExists(pollId)) {
    this.polls[pollId].questions.push(q);
  }
}

Data.prototype.getQuestion = function(pollId, qId = null) {
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
    var test={q:poll.questions[poll.currentQuestion].q, a:answers}
    return(test)
  }
  return {}
}

Data.prototype.getSubmittedAnswers = function(pollId) {
  if (this.pollExists(pollId)) {
    const poll = this.polls[pollId];
    const answers = poll.answers[poll.currentQuestion];
    if (typeof poll.questions[poll.currentQuestion] !== 'undefined') {
      return answers;
    }
  }
  return {}
}

Data.prototype.checkUserAnswer = function(pollId, qId=null, userId){
  if(this.pollExists(pollId)){
    const poll = this.polls[pollId];
    const users = poll.participants;
    if(qId !=null){
      for (const user of users){
        if(user.information.answers[qId]==null){
          user.information.answers.push(["-",0])
        }
        if(user.userId == userId){
          if(user.information.answers[qId][0]==poll.questions[qId].a.correct){ //ta bort -1 sen, är bara för att de inte skickar randomOrder på första
            //lägg till tiden för användaren
            user.information.correctedAnswers.push(true)
            user.information.time += user.information.answers[qId][1];
            console.log("totala tiden: ",user.information.time)
            return true;
          }
          else{
            if(user.information.lives>0){
              user.information.lives--;
              console.log(user.information.lives)
            }
            user.information.correctedAnswers.push(false)
            return false;
          }
        }
      }
    }
  }
  return null
}

Data.prototype.submitAnswer = function(pollId, answer, userId) { // och ta emot userId, måste skicka svaret till individuell lista & ha med correctAnswer
  if (this.pollExists(pollId)) { //vill lägga till tiden när svaret togs emot
    const poll = this.polls[pollId];
    const users = poll.participants;
    for (const key in users) {
      const user = users[key]
      if (userId==user.userId) {
        let time = poll.timer.timeLeft;
        user.information.answers.push([answer,time])
        console.log(user.information.answers, 'lyckades')
      }
    }
  }
}
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
}}





export { Data };




