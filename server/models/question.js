const mongoose = require('mongoose');
const URI = 'mongodb://dpangkey:dpangkey@cluster0-shard-00-00-blpyg.mongodb.net:27017,cluster0-shard-00-01-blpyg.mongodb.net:27017,cluster0-shard-00-02-blpyg.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin'
const Schema = mongoose.Schema

mongoose.connect(URI, { useMongoClient: true })

var question = new Schema({
  author: String,
  thread: {
    type: String,
    ref: 'Thread'
  },
  question: String,
  date: {
    type: Date,
    default: Date.now
  }
})

var Question = mongoose.model('Question', question)

function getQues(cb){
  Question.find({}, (err, ques) => {
    if(err) res.status(200).send(err)
    cb(ques)
  })
}

function postQues(){

}

module.exports = {
  Question,
  getQues
}
