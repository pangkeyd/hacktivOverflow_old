const Ques = require('../models/question')

class Question {

  static getData(req, res){
    Ques.getQues(result => {
      res.send(result)
    })
  }

}

module.exports = Question
