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
    socket.emit('questionUpdate', data.getQuestion(pollId))
    socket.emit('submittedAnswersUpdate', data.getSubmittedAnswers(pollId));
  });

  socket.on('participateInPoll', function(d) {
    data.participateInPoll(d.pollId, d.name, d.userId); //allt ska läggas in här när vi skapat det i LobbyView, id, namn och färg (det som skiljer varje spelare)
    io.to(d.pollId).emit('participantsUpdate', data.getParticipants(d.pollId));
  });
  socket.on('startPoll', function(pollId) {
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
    data.submitAnswer(d.pollId, d.answer, d.userId); // ta bort correctAnswer
    io.to(d.pollId).emit('submittedAnswersUpdate', data.getSubmittedAnswers(d.pollId));
    io.to(d.pollId).emit('participantsUpdate', data.getParticipants(d.pollId));
  }); 
  socket.on('checkUserAnswer', function(d){
    let checkedUserAnswer = data.checkUserAnswer(d.pollId,d.questionNumber,d.userId);
    io.to(d.pollId).emit('checkedUserAnswer', checkedUserAnswer);
    io.to(d.pollId).emit('participantsUpdate', data.getParticipants(d.pollId));
  });
  socket.on('getTimer', function(pollId){
    let time = data.getTime(pollId)
    io.to(pollId).emit('getTime',time)
  })
  socket.on('startTime', function(d){
    data.startTimer(d.pollId,d.time)
    io.to(d.pollId).emit('startTimer')
    //skicka till socket i resultat att timern startat
  })
  socket.on('startTimeBeforeQuestion', function(d){
    data.startTimeBeforeQuestion(d.pollId,d.time)
    io.to(d.pollId).emit('startTimerBeforeQuest')
    //socket.emit("startFirstTimer")
    //skicka till socket i resultat att timern startat
  })
  socket.on('getTimerBeforeQuestion',function(pollId){
    let time = data.getTimeBeforeQuestion(pollId)
    io.to(pollId).emit('getTimeBeforeQuestion',time)
  })
  socket.on('timesUp', function(pollId){
    io.to(pollId).emit('timeUp',true)
  })

  socket.on('runCountdown', function(d){
    let randomOrder = data.getQuestionAnswerRandom(d.pollId, d.questionNumber);
    io.to(d.pollId).emit('startCountdownPlayer', {q:randomOrder, questionNumber:d.questionNumber});
    io.to(d.pollId).emit('startCountdownResults',randomOrder.q);
  })

  socket.on('updateResult', function(pollId){
    io.to(pollId).emit('participantsUpdate', data.getParticipants(pollId));
    socket.emit('pollData', data.getPoll(pollId));
  })

  socket.on('selectBox', function(info) {
    const boxStates = data.selectBox(info);
      io.to(info.pollId).emit('boxStatesUpdate', boxStates);
  });
  

}

export { sockets };