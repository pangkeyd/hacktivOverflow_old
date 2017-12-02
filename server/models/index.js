const mongoose = require('mongoose');
const URI = 'mongodb://dpangkey:dpangkey@cluster0-shard-00-00-blpyg.mongodb.net:27017,cluster0-shard-00-01-blpyg.mongodb.net:27017,cluster0-shard-00-02-blpyg.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin'
const jwt = require('jsonwebtoken')
const Question = require('./question')
const User = require('./signup')
const Schema = mongoose.Schema

mongoose.connect(URI, { useMongoClient: true })

var thread = new Schema({
  title: String,
  description: String,
  author: String,
  question: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question'
  }],
  date: String,
  slug: String
})

var Thread = mongoose.model('Thread', thread)

function getThread(cb){
  Thread.find({}).sort([['date', 'descending']]).exec((err, thr) => {
    if(!err){
      cb(thr)
    }else{
      res.status(200).send(err)
    }
  })
}

function getThreadBySlug(params, cb){
  Thread.find({
    slug: params.slug
  }).sort([['date', 'descending']]).exec((err, thr) => {
    if(!err){
      if(thr.length > 0){
        Question.Question.find({
          thread: thr[0].slug
        }).sort([['date', 'ascending']]).exec((err, ques) => {
          if(!err){
            User.User.find({
              upvotes: thr[0].slug
            }, (err, userU) => {
              if(!err){
                User.User.find({
                  downvotes: thr[0].slug
                }, (err, userD) => {
                  if(!err){
                    let obj = {
                      thread: thr,
                      question: ques,
                      userU: userU,
                      userD: userD
                    }
                    cb(obj)
                  }
                })
              }else{
                res.status(200).send(err)
              }
            })
          }
        })
      }
    }
  })
}

function getUpVotesToThread(params, cb){
  Thread.find({
    slug: params.slug
  }, (err, thr) => {
    if(!err){
      User.User.find({
        username: params.username
      }, (err, user) => {
        if(!err){
          if(user[0].upvotes.length > 0){
            user[0].upvotes.forEach(r => {
              if(r == r){
                let already = `Thread ${thr[0].title} Sudah anda Up Votes!`
                cb(already, null)
              }
            })
          }else{
            User.User.update({
              username: params.username
            },
            {
              $push: {
                upvotes: thr[0].slug
              }
            }, (err, userU) => {
              if(!err){
                let successVotes = `Berhasil Up Votes di Thread ${thr[0].title}`
                cb(successVotes, null)
              }else{
                let failedVotes = `Gagal Up Votes di Thread ${thr[0].title}`
                cb(null, failedVotes)
              }
            })
          }
        }
      })
    }else{
      res.status(200).send(err)
    }
  })
}

function getDownVotesToThread(params, cb){
  Thread.find({
    slug: params.slug
  }, (err, thr) => {
    if(!err){
      User.User.find({
        username: params.username
      }, (err, user) => {
        if(!err){
          if(user[0].downvotes.length > 0){
            user[0].downvotes.forEach(r => {
              if(r == r){
                let already = `Thread ${thr[0].title} Sudah Anda Down Votes!`
                cb(already, null)
              }
            })
          }else{
            User.User.update({
              username: params.username
            },
            {
              $push: {
                downvotes: thr[0].slug
              }
            }, (err, userU) => {
              if(!err){
                let successDownVotes = `Berhasil di Down Votes Thread ${thr[0].title}`
                cb(successDownVotes, null)
              }else{
                let failedDownVotes = `Gagal di Down Votes Thread ${thr[0].title}`
                cb(null, failedDownVotes)
              }
            })
          }
        }
      })
    }else{
      res.status(200).send(err)
    }
  })
}

function postThread(head, body, cb){
  let token = head.token
  let decoded = jwt.verify(token, 'secret key', (err, decoded) => {
    if(decoded){
      let date = new Date()
      let dStr = date.toDateString()
      let title = body.title
      let dashTitle = title.split(' ').join('-')
      let threadSchema = new Thread({
        title: title,
        description: body.desc,
        author: decoded.username,
        date: dStr,
        slug: dashTitle
      })
      threadSchema.save((err, forum) => {
        if(!err){
          cb(forum, null)
        }else{
          res.status(200).send(err)
        }
      })
    }else{
      let error = 'Login Dulu!'
      cb(null, error)
    }
  })
}

function postQues(head, params, body, cb){
  let token = head.token
  let decoded = jwt.verify(token, 'secret key', (err, decoded) => {
    if(decoded){
      let quesSchema = new Question.Question({
        author: decoded.username,
        thread: params.slug,
        question: body.ques
      })
      quesSchema.save((err, ques) => {
        if(err) console.log(err)
        if(ques){
          let successPostQues = 'Question berhasil di Post!'
          cb(successPostQues, null)
        }else{
          let failedPostQues = 'Question tidak berhasil di post!'
          cb(null, failedPostQues)
        }
      })
    }else{
      let loginDulu = 'Login dulu bos!'
      cb(loginDulu)
    }
  })
}

function deleteThread(head, id, cb){
  let token = head.token
  let decoded = jwt.verify(token, 'secret key', (err, decoded) => {
    if(decoded){
      Thread.remove({
        _id: id
      }, (err) => {
        if(!err){
          let successDelete = 'Thread Berhasil di Delete!'
          cb(successDelete, null)
        }else{
          let failedDelete = 'Thread tidak berhasil di Delete!'
          cb(null, failedDelete)
        }
      })
    }
  })
}

function deleteQues(head, params, id, cb){
  let token = head.token
  let decoded = jwt.verify(token, 'secret key', (err, decoded) => {
    if(decoded){
      Thread.find({
        slug: params.slug
      }, (err, thr) => {
        if(!err){
          Question.Question.remove({
            _id: id
          }, (err, ques) => {
            if(!err){
              let successDelete = 'Question berhasil di Delete!'
              cb(successDelete, null)
            }else{
              let failedDelete = 'Question tidak berhasil di Delete!'
              cb(null, failedDelete)
            }
          })
        }else{
          res.status(200).send(err)
        }
      })
    }else{
      res.status(200).send(err)
    }
  })
}

function getQuesCount(params, cb){
  Question.Question.find({
    thread: params.slug
  }, (err, ques) => {
    if(!err){
      cb(ques)
    }else{
      res.status(200).send(err)
    }
  })
}

module.exports = {
  getThread,
  getThreadBySlug,
  getUpVotesToThread,
  getDownVotesToThread,
  postThread,
  postQues,
  deleteThread,
  deleteQues,
  getQuesCount
}
