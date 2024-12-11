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
    this.polls[pollId].participants.push({userId: userId, selectedBox: null, information: {name: name, answers: [], correctAnswers: [], time:0, lives:2}}) //lägg till liv, tid ect alltså allt som är samma till en början
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

Data.prototype.getTime = function(pollId){
  if(this.pollExists(pollId)){
    let time = this.polls[pollId].timer.timeLeft
    console.log("tid i getTime: ",time)
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

Data.prototype.checkAnswer = function(pollId, qId=null){ //tittar på svaret för alla deltagare, ha en separat för enskild spelare?
  //för spelaren kanske inte ska få allas svar, då får den även andras ID, ej bra
  //gör om den här sedan för att se om svaren är rätt varje gång det blir ny fråga
  //alternativt när tiden går ut, pushas allas svar socket, där den för varje svar skickar till createView som lägger ihop det i en lista
  //som sedan töms när en ny fråga ställs, alternativt ha ett object med correct/false för varje spelare för varje svar
  let answers = {};
  if (this.pollExists(pollId)){
    const poll = this.polls[pollId];
    if (qId != null){
      for(const user of poll.participants){
          if(user.information.answers[qId]==poll.questions[qId].a.correct){
            answers[user.userId] = true;
          }
          else{
            answers[user.userId] = false;
          }
      }
      return answers;
    }
  }
  return {}
}

Data.prototype.checkUserAnswer = function(pollId, qId=null, userId){
  if(this.pollExists(pollId)){
    const poll = this.polls[pollId];
    const users = poll.participants;
    console.log("hej från checkUser")
    if(qId !=null){
      for (const user of users){
        if(user.userId == userId){
          console.log("user: ",user);
          console.log("qId: ",qId);
          console.log("question: ",poll.questions[qId])
          if(user.information.answers[qId-1]==poll.questions[qId].a.correct){ //ta bort -1 sen, är bara för att de inte skickar randomOrder på första
            console.log("svar rätt")
            return true;
          }
          else{
            return false;
          }
        }
      }
    }
  }
  return null
}

Data.prototype.submitAnswer = function(pollId, answer, correctAnswer, userId) { // och ta emot userId, måste skicka svaret till individuell lista & ha med correctAnswer
  if (this.pollExists(pollId)) {
    const poll = this.polls[pollId];
    const users = poll.participants;
    for (const key in users) {
      const user = users[key]
      console.log('in for loop', users[key])
      console.log('userId', user.userId)
      if (userId==user.userId) {
        user.information.answers.push(answer)
        user.information.correctAnswers.push(correctAnswer)
        console.log(user.information.answers, 'lyckades')
      }
    }

  // För redigering av frågor
Data.prototype.updateQuestion = function (pollId, question) {
  const poll = this.getPoll(pollId);
  if (!poll) {
    return null;
  }
  const questionIndex = poll.questions.findIndex(q => q.q === question.q);
  if (questionIndex === -1) {
    return null; 
  }
  poll.questions[questionIndex] = question;
  return question;
};  

    /*
    let answers = poll.answers[poll.currentQuestion]; // poll.participant.information.answer
    // create answers object if no answers have yet been submitted
    if (typeof answers !== 'object') {
      answers = {};
      answers[answer] = 1;
      poll.answers.push(answers);
    }
    // create answer property if that specific answer has not yet been submitted
    else if (typeof answers[answer] === 'undefined') {
      answers[answer] = 1;
    }
    // if the property already exists, increase the number
    else
      answers[answer] += 1
    console.log("answers looks like ", answers, typeof answers);
    */
  }
}

export { Data };

/*let answers=['','','',''];
let currentQuest = poll.question[poll.currentQuestion];
let avalibleSlots = [0,1,2,3];
var index = Math.floor(Math.random()*4);
answers[index] = currentQuest.a.correct;
avalibleSlots.slice(index,1);
for(const wrongAnsw of currentQuest.a.wrong){
  index=Math.floor(Math.random()*avalibleSlots.length);
  answers[avalibleSlots[index]]=wrongAnsw;
  avalibleSlots.splice(index,1);
};*/
//return {q:currentQuest.q, a:{correct:"",wrong:["h","j","t","e"]}}


