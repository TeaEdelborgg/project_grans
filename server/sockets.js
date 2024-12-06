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
    io.to(d.pollId).emit('submittedAnswersUpdate', data.getSubmittedAnswers(d.pollId)); 
  });

  socket.on('submitAnswer', function(d) {
    data.submitAnswer(d.pollId, d.answer, d.correctAnswer, d.userId); // ta emot userId & ha med correctAnswer
    io.to(d.pollId).emit('submittedAnswersUpdate', data.getSubmittedAnswers(d.pollId));
    io.to(d.pollId).emit('participantsUpdate', data.getParticipants(d.pollId));
  }); 
  socket.on('checkAnswer', function(d) {
    let checkedAnswers = data.checkAnswer(d.pollId, d.questionNumber);
    io.to(d.pollId).emit('checkedAnswer', checkedAnswers);
  });
  socket.on('checkUserAnswer', function(d){
    let checkedUserAnswer = data.checkUserAnswer(d.pollId,d.questionNumber,d.userId);
    io.to(d.pollId).emit('checkedUserAnswer', checkedUserAnswer);
  });
  socket.on('getTimer', function(pollId){
    let time = data.getTime(pollId)
    io.to(pollId).emit('getTime',time)
  })
  socket.on('startTime', function(d){
    data.startTimer(d.pollId,d.time)
  })
  socket.on('timesUp', function(pollId){
    io.to(pollId).emit('timeUp',true)
  })
}

export { sockets };