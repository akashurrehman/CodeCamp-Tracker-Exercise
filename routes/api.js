const express = require('express')
const router = express.Router()
const Users = require('../models/users')


router.post('/users', async (req, res) => {
  try{

    let user = await Users.find({username: req.body.username})
    
    if (user.length > 0) {
      return res.send('Username already taken')
    }

    let newUser = new Users({
    username: req.body.username
    })

    await newUser.save()
    
    res.status(201).json({username: newUser.username, _id: newUser._id})

  } catch (err) {
    return res.status(500).json({message: err.message})
  } 
})

router.get('/users', async (req, res) => {
  try {
    const users = await Users.find()
    let usersAarray = []
    for (let user of users) {
      usersAarray.push({username: user.username, _id: user._id})
    }
    
    res.json(usersAarray)
  } catch (err) {
    res.status(500).json({message: err.message})
  }
})

router.post('/users/:_id/exercises', async (req, res) => {
  let userId = req.params._id
  let description = req.body.description
  let duration = req.body.duration
  let date = req.body.date === '' || req.body.date === undefined ? new Date() : new Date(req.body.date)
  
  /* Check user inputs */
  if (description === '') return res.send('Path `description` is required.')
  if (duration === '') return res.send('Path `duration` is required.')

  try {
    let user = await Users.findOne({_id: userId})

    if (typeof user !== 'object') {
      return res.send('Unknown userId')
    }

    user.exercises.push( {
      description: description,
      duration: Number(duration),
      date: date.toDateString()
    })

    await user.save()

    res.json({_id:user._id, username: user.username, date: date.toDateString(), duration: Number(duration), description: description})
  } catch (err) {
    res.status(500).json({message: err.message})
  }
})

router.get('/users/:_id/logs', async (req, res) => {
  let userId = req.params._id
  let limit = req.query.limit
  let fromDate = req.query.from
  let toDate = req.query.to

  try {
    let user = await Users.findById(userId)

    let exercises = user.exercises

    if (fromDate) {
      exercises = exercises.filter(exercise => Date.parse(exercise.date) >= new Date(fromDate).getTime())
    }
    if (toDate) {
      exercises = exercises.filter(exercise => Date.parse(exercise.date) <= new Date(toDate).getTime())
    }
    if (limit && Number(limit) !== NaN) {
      exercises =  exercises.filter(exercise => exercises.indexOf(exercise) < limit)
    }
    
    return res.json({_id: user._id, username: user.username, count: exercises.length, log: exercises})
  } catch (err) {
    res.status(500).json({message: err.message})
  }

})

router.get('*', function(req, res){
  return res.status(404).send('not found');
});

module.exports = router;