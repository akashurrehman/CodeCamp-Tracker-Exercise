require('dotenv').config()

const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')

app.use(cors())
app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({extended: true}))

const usersRouter = require('./routes/api')
app.use('/api', usersRouter)

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

const listener = app.listen(process.env.PORT || 3000, () => {
    console.log('Your app is listening on port ' + listener.address().port)
})

mongoose.connect("mongodb+srv://akashurrehman123:WgE7Wtk79FCL7QIN@cluster0.se4lf.mongodb.net/?retryWrites=true&w=majority", { useNewUrlParser: true })
    .then(() => console.log("Connected to MongoDB...."))
    .catch((error) => console.log(error.message));
