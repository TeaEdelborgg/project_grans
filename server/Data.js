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
    this.polls[pollId].participants.push({userId: userId, information: {name: name, answers: [], correctAnswers: [], time:0, lives:2}}) //lägg till liv, tid ect alltså allt som är samma till en början
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


