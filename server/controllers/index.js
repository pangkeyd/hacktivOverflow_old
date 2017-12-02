const Indexs = require('../models/index')

class Index {

  static getData(req, res){
    Indexs.getThread(result => {
      res.send(result)
    })
  }

  static getDataBySlug(req, res){
    Indexs.getThreadBySlug(req.params, (result) => {
      res.send(result)
    })
  }

  static getVotesData(req, res){
    Indexs.getUpVotesToThread(req.params, (result, auth) => {
      if(result){
        res.send(result)
      }else{
        res.send(auth)
      }
    })
  }

  static getDownVotesData(req, res){
    Indexs.getDownVotesToThread(req.params, (result, auth) => {
      if(result){
        res.send(result)
      }else{
        res.send(auth)
      }
    })
  }

  static postData(req, res){
    Indexs.postThread(req.headers, req.body, (result, auth) => {
      if(result){
        res.send(result)
      }else{
        res.send(auth)
      }
    })
  }

  static postQuestion(req, res){
    Indexs.postQues(req.headers, req.params, req.body, (result) => {
      res.send(result)
    })
  }

  static deleteData(req, res){
    Indexs.deleteThread(req.headers, req.params._id, (result, auth) => {
      if(result){
        res.send(result)
      }else{
        res.send(auth)
      }
    })
  }

  static deleteQuestion(req, res){
    Indexs.deleteQues(req.headers, req.params, req.params._id, (result, auth) => {
      if(result){
        res.send(result)
      }else{
        res.send(auth)
      }
    })
  }

  static getDataQuesCount(req, res){
    Indexs.getQuesCount(req.params, (result) => {
      res.send(result)
    })
  }

}

module.exports = Index
