const express = require('express');
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')

app.use(cors())

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

const signup = require('./routes/signup')
const signin = require('./routes/signin')
const index = require('./routes/index')
const question = require('./routes/question')

app.use('/signup', signup)
app.use('/signin', signin)
app.use('/', index)
app.use('/question', question)

app.listen(3000, () => {
  console.log(`AYO JALAN!`)
})
