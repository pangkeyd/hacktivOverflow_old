const Users = require('../models/signup')

class User {

  static getData(req, res){
    Users.getUser(result => {
      res.send(result)
    })
  }

  static getDataEmailExist(req, res){
    Users.getUserEmailExist(req.params, (result) => {
      res.send(result)
    })
  }

  static getDataUserExist(req, res){
    Users.getUserNameExist(req.params, (result) => {
      res.send(result)
    })
  }

  static saveData(req, res){
    Users.saveUser(req.body, (result, auth) => {
      if(result){
        res.send(result)
      }else{
        res.send(auth)
      }
    })
  }

}

module.exports = User
