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
    io.to(d.pollId).emit('randomOrderUpdate', randomOrder);
    io.to(d.pollId).emit('questionUpdate', question);
    io.to(d.pollId).emit('submittedAnswersUpdate', data.getSubmittedAnswers(d.pollId));
  });

  socket.on('submitAnswer', function(d) {
    data.submitAnswer(d.pollId, d.answer, d.correctAnswer, d.userId); // ta emot userId & ha med correctAnswer
    io.to(d.pollId).emit('submittedAnswersUpdate', data.getSubmittedAnswers(d.pollId));
    io.to(d.pollId).emit('participantsUpdate', data.getParticipants(d.pollId));
  }); 

  socket.on('selectBox', function (payload) {
    const { pollId, boxIndex, userId, label } = payload;
    const poll = data.getPoll(pollId);
  
    if (!poll || !poll.participants) {
      console.error("Poll or participants not found");
      return;
    }
    const participant = poll.participants.find((p) => p.userId === userId);
    if (participant) {
      participant.selectedBox = boxIndex;
      participant.information.boxLabel = label;
    } else {
        console.error("participant not found")
    }
  
    const boxStates = poll.participants.map((p) => ({
      boxIndex: p.selectedBox,
      userId: p.userId,
      label: p.information.name || `Player ${p.userId}`,
    }));
  
    io.to(pollId).emit('boxStatesUpdate', boxStates);
  });
}

export { sockets };