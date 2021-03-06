const express = require('express')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(express.json())

const pwd = require('./auth/pwd.js')
// test encode
pwd
  .encode("veggie")
  .then(hash => console.log(hash))
  .catch(err => err)
// test compare
pwd
  .encode('veggie')
  .then( hash => pwd.compare('bacon', hash))
  .then( isMatch => console.log(isMatch))
  .catch(err => console.log('error : ', err))


  // .then(hash => pwd.comparePassword("bacon", hash))
  // .then(trueOrFalse => console.log("Coucou je suis : ", trueOrFalse));

// middleware to escape simple quotes
// I use simple quotes in SQL queries (cf. model)
app.use((req, res, next) => {
  req.body = Object.entries(req.body).reduce(( acc, [key, value] ) => {
    acc[key] = (typeof value === 'string') ? value.replace(/\'/g, '\'\'') : value
    return acc
  }, {})
  next();
})

app.use('/lists', require('./controllers/list'))
app.use('/cards', require('./controllers/card'))
app.use('/users', require('./controllers/user'))

app.all('/*', (req, res, ) => {
  res.status(404).send('je suis la 404')
})


const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`Connected server on port ${port} ( http://localhost:${port} )`)
})
.on('error', err => console.log('erreur de connexion : ', err))