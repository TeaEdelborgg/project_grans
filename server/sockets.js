import { useId } from "vue";

function sockets(io, socket, data) {
  
  socket.on('getUILabels', function(lang) {
    socket.emit('uiLabels', data.getUILabels(lang));
  });

  socket.on('createPoll', function(d) {
    data.createPoll(d.pollId, d.lang)
    socket.emit('pollData', data.getPoll(d.pollId));
  });

  socket.on('addQuestion', function(d) {
    data.addQuestion(d.pollId, d.q);
    socket.emit('questionUpdate', data.getQuestion(d.pollId));
  });

  socket.on("updateQuestion", function({ pollId, questionToUpdate }) {
    if (questionToUpdate) {
      data.updateQuestion(pollId, questionToUpdate);
    }
  });

  socket.on('joinPoll', function(pollId) {
    socket.join(pollId);
    socket.emit('questionUpdate', data.getQuestion(pollId))
  });

  socket.on('participateInPoll', function(d) {
    data.participateInPoll(d.pollId, d.name, d.userId, d.color); 
    io.to(d.pollId).emit('participantsUpdate', data.getParticipants(d.pollId));
  });

  socket.on('getParticipants', function(pollId){
    io.to(pollId).emit('participantsUpdate', data.getParticipants(pollId));
  });

  socket.on("selectColor", function (info) {
    const updatedParticipants = data.updateColorSelection(info);
    io.to(info.pollId).emit("colorSelectionUpdate", updatedParticipants);
  });

  socket.on('startPoll', function(pollId) {
    data.setQuestionAmount(pollId);
    data.setAnswersFalse(pollId);
    data.setPedestalLightFalse(pollId);
    data.createBoxes(pollId);
    io.to(pollId).emit('startPoll');
  });

  socket.on('getPlayer', function(d) {
    io.to(d.pollId).emit('sendPlayerStats', data.getOneParticipant(d.pollId, d.userId));
  }); 

  socket.on('getTimer', function(pollId) {
    io.to(pollId).emit('sendTimer', data.getTimer(pollId));
  })

  socket.on('runQuestion', function(d) { 
    let question = data.getQuestion(d.pollId, d.questionNumber);
    let randomOrder = data.getAnswerRandomOrder(d.pollId, d.questionNumber);
    io.to(d.pollId).emit('randomOrderUpdate', {q:randomOrder, questionNumber:d.questionNumber});
    io.to(d.pollId).emit('questionUpdate', question);
    io.to(d.pollId).emit('questionUpdateResult',randomOrder.q)
  });

  socket.on('fiftyFifty', function(d) {
    io.to(d.pollId).emit('sendFiftyFifty', data.getFiftyFifty(d.pollId, d.userId))
    io.to(d.pollId).emit('sendPlayerStats', data.getOneParticipant(d.pollId, d.userId));
  });

  socket.on('audienceAnswer', function(d) {
    io.to(d.pollId).emit('sendAudienceAnswer', data.getAudienceAnswer(d.pollId, d.userId, d.usedFiftyFifty))
    io.to(d.pollId).emit('sendPlayerStats', data.getOneParticipant(d.pollId, d.userId));
  })

  socket.on('submitAnswer', function(d) { 
    data.submitAnswer(d.pollId, d.questionNumber, d.answer, d.userId, d.time);
    let updatePedestal = data.updatePedestalLight(d.pollId, d.userId)
    let participant=data.getParticipants(d.pollId)
    io.to(d.pollId).emit('updatePedestalLight', updatePedestal); 
    io.to(d.pollId).emit('participantsUpdate', participant);

    data.checkUserAnswer(d.pollId,d.questionNumber,d.userId); 
  }); 

  socket.on("getCorrectedUserAnswer", function(d){ 
    let checkedUserAnswer = data.getCorrectedAnswer(d.pollId,d.questionNumber,d.userId);
    socket.emit('sendCorrectedUserAnswer', checkedUserAnswer)
  });

  socket.on('getAllAnswers', function(pollId){ 
    let participantsPillarHeight = data.updatePillarHeight(pollId)
    let levelBoxes = data.updateLevelBoxes(pollId) 
    io.to(pollId).emit("updateAfterQuestion", {participants:participantsPillarHeight,levelBoxes:levelBoxes})
  }); 

  socket.on('runCountdown', function(d){
    let randomOrder = data.getAnswerRandomOrder(d.pollId, d.questionNumber);
    let correctAnswer = data.getCorrectAnswer(d.pollId, d.questionNumber)
    let pedestalLight = data.resetPedestalLight(d.pollId)
    io.to(d.pollId).emit('startCountdownPlayer', {q:randomOrder, questionNumber:d.questionNumber});
    io.to(d.pollId).emit('startCountdownResults',{q:randomOrder,questionNumber:d.questionNumber, correctAnswer:correctAnswer, pedestalLight:pedestalLight}); //lägg till det rätta svaret också
    io.to(d.pollId).emit('currentQuestionUpdate', d.questionNumber);
  });

  socket.on('endTimer', function(pollId){
    io.to(pollId).emit('resetTime')
  });

  socket.on('updateResult', function(pollId){
    socket.emit('pollData', data.getPoll(pollId));
  });

  socket.on('getStats', function(pollId) {
    const amountOfQuestions = data.getPoll(pollId).questionAmount
    const levelValues = data.getLevelValues(pollId)
    const levelColors = data.updateLevelBoxes(pollId)
    const participants = data.getParticipants(pollId)
    const pedestalLight = data.getPedestalLight(pollId)
    const timer = data.getTimer(pollId)
    io.to(pollId).emit('loadStats', {amountOfQuestions:amountOfQuestions, levelValues:levelValues, levelColors:levelColors, participants:participants, pedestalLight:pedestalLight, timer:timer}) //skicka som object
  });

  socket.on('getStartColors', function(pollId){
    const levelBoxes = data.updateLevelBoxes(pollId)
    io.to(pollId).emit('sendStartColors',levelBoxes)
  });

  socket.on('finishGame', function(pollId){
    io.to(pollId).emit('gameFinished')
  });

  socket.on('createScoreBoard', function(pollId){
    data.countScore(pollId)
    socket.emit('scoreBoardCreated')
  });
  
  socket.on('getScoreBoard', function(pollId){
    const scoreBoard = data.getScoreBoard(pollId)
    socket.emit('sendScoreBoard',scoreBoard) 
  });

  socket.on('clearParticipants', function(pollId){
    data.clearParticipants(pollId)
    io.to(pollId).emit('participantsUpdate', data.getParticipants(pollId));
  });
}

export { sockets };