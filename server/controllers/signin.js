const Users = require('../models/signin')

class User {

  static getData(req, res){
    Users.getUser(result => {
      res.send(result)
    })
  }

  static saveData(req, res){
    Users.signIn(req.body, (result, auth) => {
      if(result){
        res.send(result)
      }else{
        res.send(auth)
      }
    })
  }

}

module.exports = User
