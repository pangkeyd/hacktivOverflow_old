const mongoose = require('mongoose')
const URI = 'mongodb://dpangkey:dpangkey@cluster0-shard-00-00-blpyg.mongodb.net:27017,cluster0-shard-00-01-blpyg.mongodb.net:27017,cluster0-shard-00-02-blpyg.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin'
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('./signup')

mongoose.connect(URI, { useMongoClient: true })

function getUser(cb){
  User.User.find({}, (err, user) => {
    if(err) res.status(200).send(err)
    cb(user)
  })
}

function signIn(body, cb){
  User.User.find({
    username: body.user
  }, (err, user) => {
    if(user.length > 0){
      let resPass = bcrypt.compareSync(body.pass, user[0].password)
      if(resPass){
        let obj = {
          username: user[0].username,
          id: user[0]._id
        }
        let token = jwt.sign(obj, 'secret key')
        cb(token, null)
      }else{
        let error = 'Wrong Username or Password!'
        cb(null, error)
      }
    }else{
      let error = 'Wrong Username or Password!'
      cb(null, error)
    }
  })
}

module.exports = {
  getUser,
  signIn
}
