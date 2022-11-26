const express = require('express')
const app = express()
const port = 3000

app.set('view engine', 'ejs');
app.get('/', (req, res) => {
  res.send('Hello World! 1233')
})
app.get('/signup', (req, res) => {
  res.render('signup');
})
app.get('/signin', (req, res) => {
  res.render('signin');
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})