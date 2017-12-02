const mongoose = require('mongoose')
const URI = 'mongodb://dpangkey:dpangkey@cluster0-shard-00-00-blpyg.mongodb.net:27017,cluster0-shard-00-01-blpyg.mongodb.net:27017,cluster0-shard-00-02-blpyg.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin'
const bcrypt = require('bcrypt')
const Schema = mongoose.Schema
const saltRounds = 8

mongoose.connect(URI, { useMongoClient: true })

var user = new Schema({
  email: {
    type: String,
    index: true,
    unique: true
  },
  username: {
    type: String,
    index: true,
    unique: true
  },
  password: String,
  salt: String,
  upvotes: [{
    type: String,
    ref: 'Thread'
  }],
  downvotes: [{
    type: String,
    ref: 'Thread'
  }]
})

var User = mongoose.model('User', user)

function getUser(cb){
  User.find({}, (err, user) => {
    if(err) res.status(200).send(err)
    cb(user)
  })
}

function getUserEmailExist(params, cb){
  User.find({
    email: params.email
  }, (err, user) => {
    if(err) res.status(200).send(err)
    cb(user)
  })
}

function getUserNameExist(params, cb){
  User.find({
    username: params.user
  }, (err, user) => {
    if(err) res.status(200).send(err)
    cb(user)
  })
}

function saveUser(body, cb){
  bcrypt.genSalt(saltRounds, (err, salt) => {
    bcrypt.hash(body.pass, salt, (err, hash) => {
      let userSchema = new User({
        email: body.email,
        username: body.user,
        password: hash,
        salt: hash
      })
      userSchema.save((err, user) => {
        console.log(user)
        if(!err){
          cb(user, null)
        }else if(err.code == 11000){
          let obj = {
            uniqueEmail: 'Email must be Unique!',
            uniqueUsername: 'Username must be Unique!'
          }
          if(err.message.indexOf('email_1') !== -1){
            cb(null, obj.uniqueEmail)
          }else if(err.message.indexOf('username_1') !== -1){
            cb(null, obj.uniqueUsername)
          }
        }
      })
    })
  })
}

module.exports = {
  User,
  getUser,
  getUserEmailExist,
  getUserNameExist,
  saveUser
}
