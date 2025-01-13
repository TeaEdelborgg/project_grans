import { useId } from "vue";

function sockets(io, socket, data) {
  
  socket.on('getUILabels', function(lang) {
    socket.emit('uiLabels', data.getUILabels(lang));
  });

  socket.on('createPoll', function(d) {
    data.createPoll(d.quizId, d.lang)
    socket.emit('quizData', data.getPoll(d.quizId));
  });

  socket.on('addQuestion', function(d) {
    data.addQuestion(d.quizId, d.q);
    socket.emit('questionUpdate', data.getQuestion(d.quizId));
  });

  socket.on("updateQuestion", function({ quizId, questionToUpdate }) {
    if (questionToUpdate) {
      data.updateQuestion(quizId, questionToUpdate);
    }
  });

  socket.on('joinPoll', function(quizId) {
    socket.join(quizId);
    socket.emit('questionUpdate', data.getQuestion(quizId))
  });

  socket.on('participateInPoll', function(d) {
    data.participateInPoll(d.quizId, d.name, d.userId, d.color); 
    io.to(d.quizId).emit('participantsUpdate', data.getParticipants(d.quizId));
  });

  socket.on('getParticipants', function(quizId){
    io.to(quizId).emit('participantsUpdate', data.getParticipants(quizId));
  });

  socket.on("selectColor", function (info) {
    const updatedParticipants = data.updateColorSelection(info);
    io.to(info.quizId).emit("colorSelectionUpdate", updatedParticipants);
  });

  socket.on('startPoll', function(quizId) {
    data.setQuestionAmount(quizId);
    data.setAnswersFalse(quizId);
    data.setPedestalLightFalse(quizId);
    data.createBoxes(quizId);
    io.to(quizId).emit('startPoll');
  });

  socket.on('getPlayer', function(d) {
    io.to(d.quizId).emit('sendPlayerStats', data.getOneParticipant(d.quizId, d.userId));
  }); 

  socket.on('getTimer', function(quizId) {
    io.to(quizId).emit('sendTimer', data.getTimer(quizId));
  })

  socket.on('runQuestion', function(d) { 
    let question = data.getQuestion(d.quizId, d.questionNumber);
    let randomOrder = data.getAnswerRandomOrder(d.quizId, d.questionNumber);
    io.to(d.quizId).emit('randomOrderUpdate', {q:randomOrder, questionNumber:d.questionNumber});
    io.to(d.quizId).emit('questionUpdate', question);
    io.to(d.quizId).emit('questionUpdateResult',randomOrder.q)
  });

  socket.on('fiftyFifty', function(d) {
    io.to(d.quizId).emit('sendFiftyFifty', data.getFiftyFifty(d.quizId, d.userId))
    io.to(d.quizId).emit('sendPlayerStats', data.getOneParticipant(d.quizId, d.userId));
  });

  socket.on('audienceAnswer', function(d) {
    io.to(d.quizId).emit('sendAudienceAnswer', data.getAudienceAnswer(d.quizId, d.userId, d.usedFiftyFifty))
    io.to(d.quizId).emit('sendPlayerStats', data.getOneParticipant(d.quizId, d.userId));
  })

  socket.on('submitAnswer', function(d) { 
    data.submitAnswer(d.quizId, d.questionNumber, d.answer, d.userId, d.time);
    let updatePedestal = data.updatePedestalLight(d.quizId, d.userId)
    let participant=data.getParticipants(d.quizId)
    io.to(d.quizId).emit('updatePedestalLight', updatePedestal); 
    io.to(d.quizId).emit('participantsUpdate', participant);

    data.checkUserAnswer(d.quizId,d.questionNumber,d.userId); 
  }); 

  socket.on("getCorrectedUserAnswer", function(d){ 
    let checkedUserAnswer = data.getCorrectedAnswer(d.quizId,d.questionNumber,d.userId);
    socket.emit('sendCorrectedUserAnswer', checkedUserAnswer)
  });

  socket.on('getAllAnswers', function(quizId){ 
    let participantsPillarHeight = data.updatePillarHeight(quizId)
    let levelBoxes = data.updateLevelBoxes(quizId) 
    io.to(quizId).emit("updateAfterQuestion", {participants:participantsPillarHeight,levelBoxes:levelBoxes})
  }); 

  socket.on('runCountdown', function(d){
    let randomOrder = data.getAnswerRandomOrder(d.quizId, d.questionNumber);
    let correctAnswer = data.getCorrectAnswer(d.quizId, d.questionNumber)
    let pedestalLight = data.resetPedestalLight(d.quizId)
    io.to(d.quizId).emit('startCountdownPlayer', {q:randomOrder, questionNumber:d.questionNumber});
    io.to(d.quizId).emit('startCountdownResults',{q:randomOrder,questionNumber:d.questionNumber, correctAnswer:correctAnswer, pedestalLight:pedestalLight}); //lägg till det rätta svaret också
    io.to(d.quizId).emit('currentQuestionUpdate', d.questionNumber);
  });

  socket.on('endTimer', function(quizId){
    io.to(quizId).emit('resetTime')
  });

  socket.on('updateResult', function(quizId){
    socket.emit('quizData', data.getPoll(quizId));
  });

  socket.on('getStats', function(quizId) {
    const amountOfQuestions = data.getPoll(quizId).questionAmount
    const levelValues = data.getLevelValues(quizId)
    const levelColors = data.updateLevelBoxes(quizId)
    const participants = data.getParticipants(quizId)
    const pedestalLight = data.getPedestalLight(quizId)
    const timer = data.getTimer(quizId)
    io.to(quizId).emit('loadStats', {amountOfQuestions:amountOfQuestions, levelValues:levelValues, levelColors:levelColors, participants:participants, pedestalLight:pedestalLight, timer:timer}) //skicka som object
  });

  socket.on('getStartColors', function(quizId){
    const levelBoxes = data.updateLevelBoxes(quizId)
    io.to(quizId).emit('sendStartColors',levelBoxes)
  });

  socket.on('finishGame', function(quizId){
    io.to(quizId).emit('gameFinished')
  });

  socket.on('createScoreBoard', function(quizId){
    data.countScore(quizId)
    socket.emit('scoreBoardCreated')
  });
  
  socket.on('getScoreBoard', function(quizId){
    const scoreBoard = data.getScoreBoard(quizId)
    socket.emit('sendScoreBoard',scoreBoard) 
  });

  socket.on('clearParticipants', function(quizId){
    data.clearParticipants(quizId)
    io.to(quizId).emit('participantsUpdate', data.getParticipants(quizId));
  });
}

export { sockets };