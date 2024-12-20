function sockets(io, socket, data) {
  
  socket.on('getUILabels', function(lang) {
    socket.emit('uiLabels', data.getUILabels(lang));
  });

  socket.on('createPoll', function(d) {
    data.createPoll(d.pollId, d.lang)
    socket.emit('pollData', data.getPoll(d.pollId));
  });

  socket.on('addQuestion', function(d) {
    data.addQuestion(d.pollId, {q: d.q, a: d.a});
    socket.emit('questionUpdate', data.getQuestion(d.pollId));
  });

  socket.on("updateQuestion", ({ pollId, question }) => {
    const updatedQuestion = data.updateQuestion(pollId, question);
    if (updatedQuestion) {
      io.to(pollId).emit('questionUpdate', updatedQuestion); 
    } else {
      socket.emit('error', 'Question update failed');
    }
  });

  socket.on('joinPoll', function(pollId) {
    socket.join(pollId);
    console.log("spelare dgick med: ",pollId)
    console.log("rummen som spelaren är med i: ", socket.rooms)
    socket.emit('questionUpdate', data.getQuestion(pollId))
    socket.emit('submittedAnswersUpdate', data.getSubmittedAnswers(pollId));
    /*
    if (data.pollExists(pollId)) {
      const pollStarted = data.hasPollStarted(pollId);
      socket.emit('pollStatus', {started: pollStarted});
      if (!pollStarted) {
        socket.join(pollId);
        socket.emit('questionUpdate', data.getQuestion(pollId))
        socket.emit('submittedAnswersUpdate', data.getSubmittedAnswers(pollId));
      }
    }*/
  });

  socket.on('participateInPoll', function(d) {
    data.participateInPoll(d.pollId, d.name, d.userId, d.color); //allt ska läggas in här när vi skapat det i LobbyView, id, namn och färg (det som skiljer varje spelare)
    io.to(d.pollId).emit('participantsUpdate', data.getParticipants(d.pollId));
  });
  socket.on('startPoll', function(pollId) {
    data.createBoxes(pollId)
    data.setAnswersFalse(pollId)
    /*data.polls[pollId].started = true;*/
    io.to(pollId).emit('startPoll');
  })
  socket.on('runQuestion', function(d) {
    let question = data.getQuestion(d.pollId, d.questionNumber);
    let randomOrder = data.getQuestionAnswerRandom(d.pollId, d.questionNumber);
    io.to(d.pollId).emit('randomOrderUpdate', {q:randomOrder, questionNumber:d.questionNumber});
    io.to(d.pollId).emit('questionUpdate', question);
    io.to(d.pollId).emit('questionUpdateResult',randomOrder.q)
    io.to(d.pollId).emit('submittedAnswersUpdate', data.getSubmittedAnswers(d.pollId)); 
  });

  socket.on('submitAnswer', function(d) {
    data.submitAnswer(d.pollId, d.answer, d.userId, d.time); // ta bort correctAnswer
    //skicka till resultat med pollId och userId
    io.to(d.pollId).emit('updatePedestalPlayer', d.userId)
    //io.to(d.pollId).emit('submittedAnswersUpdate', data.getSubmittedAnswers(d.pollId));
    io.to(d.pollId).emit('participantsUpdate', data.getParticipants(d.pollId)); //borde kunna ta bort
    console.log('submitAnswer i socket körs')
  }); 
  socket.on('checkUserAnswer', function(d){
    console.log("i socket, ska titta om svaret är rätt")
    let checkedUserAnswer = data.newCheckUserAnswer(d.pollId,d.questionNumber,d.userId);
    console.log('i checkUserAnswer, checkeduseranswer är: ', checkedUserAnswer)
    io.to(d.pollId).emit('checkedUserAnswer', checkedUserAnswer);
    //io.to(d.pollId).emit('participantsUpdate', data.getParticipants(d.pollId));
  });
  socket.on("testUserAnswers", function(d){
    data.testCheckAnswers(d.pollId,d.questionNumber)
    
    //här vill vi skicka tillbaka till resultat, som sedan där emitar till att hämta resultat
  })

  socket.on('getAllAnswers', function(pollId){ //döp om
    let participantsWithNewAnswersTest = data.updateColoredBoxes(pollId)
    let levelBoxes = data.updateLevelBoxes(pollId) 
    io.to(pollId).emit("sendAllAnswers", {participants:participantsWithNewAnswersTest,levelBoxes:levelBoxes})
  })
  /*socket.on('getTimer', function(pollId){ //ta bort
    let time = data.getTime(pollId)
    io.to(pollId).emit('getTime',time)
  })*/
  /*socket.on('startTime', function(d){ //ta bort
    data.startTimer(d.pollId,d.time)
    io.to(d.pollId).emit('startTimer')
    //skicka till socket i resultat att timern startat
  })*/
  /*socket.on('startTimeBeforeQuestion', function(d){ //ta bort
    data.startTimeBeforeQuestion(d.pollId,d.time)
    io.to(d.pollId).emit('startTimerBeforeQuest')
    //socket.emit("startFirstTimer")
    //skicka till socket i resultat att timern startat
  })*/
  /*socket.on('getTimerBeforeQuestion',function(pollId){ //ta bort
    let time = data.getTimeBeforeQuestion(pollId)
    io.to(pollId).emit('getTimeBeforeQuestion',time)
  })*/
  /*socket.on('timesUp', function(pollId){ //körs aldrig
    io.to(pollId).emit('timeUp',true)
  })*/

  socket.on('runCountdown', function(d){
    let randomOrder = data.getQuestionAnswerRandom(d.pollId, d.questionNumber);
    io.to(d.pollId).emit('startCountdownPlayer', {q:randomOrder, questionNumber:d.questionNumber});
    io.to(d.pollId).emit('startCountdownResults',{q:randomOrder.q,questionNumber:d.questionNumber});
  })

  socket.on('updateResult', function(pollId){
    io.to(pollId).emit('participantsUpdate', data.getParticipants(pollId));
    socket.emit('pollData', data.getPoll(pollId));
  })
/*
  socket.on('selectBox', function(info) {
    const boxStates = data.selectBox(info);
      io.to(info.pollId).emit('boxStatesUpdate', boxStates);
  });*/

  socket.on('getStats', function(pollId) {
    const amountOfQuestions = data.amountOfQuestions(pollId);
    const levelValues = data.getLevelValues(pollId)
    const levelColors = data.updateLevelBoxes(pollId)
    const participants = data.getParticipants(pollId)
    console.log("försöker skicka levelCOlor")
    io.to(pollId).emit('loadStats', {amountOfQuestions:amountOfQuestions, levelValues:levelValues, levelColors:levelColors, participants:participants}) //skicka som object
  });
  socket.on('getStartColors', function(pollId){
    const levelBoxes = data.updateLevelBoxes(pollId)
    io.to(pollId).emit('sendStartColors',levelBoxes)
  })
  socket.on('finishGame', function(pollId){
    io.to(pollId).emit('gameFinished')
  })
  socket.on('createScoreBoard', function(pollId){
    data.countScore(pollId)
    socket.emit('scoreBoardCreated')
  })

  socket.on('getScoreBoard', function(pollId){
    const scoreBoard = data.getScoreBoard(pollId)
    //socket.join(pollId);
    //skicka här direkt till användarna
    //io.emit("scoreBoardUser", scoreBoard) //.to(pollId)
    socket.emit('sendScoreBoard',scoreBoard) //ändra till socket.io
  })
  /*socket.on('getScoreBoardUser', function(pollId){ //denna används inte just nu
    const scoreBoard = data.getScoreBoard(pollId)
    console.log("getScoreBoardUser")
    socket.emit("scoreBoardUser", scoreBoard) //ändra till socket.io
  })*/
}

export { sockets };