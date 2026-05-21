const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const usersRouter = require('./routes/users')
const restaurantsRouter = require('./routes/restaurants')
const dishesRouter = require('./routes/dishes')
const ordersRouter = require('./routes/orders')

const app = express()
app.use(cors())
app.use(express.json())

app.use("/users", usersRouter)
app.use("/restaurants", restaurantsRouter)
app.use("/dishes", dishesRouter)
app.use("/orders", ordersRouter)

mongoose.connect('mongodb://127.0.0.1:27017/foodDB')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err))

app.listen(5000, () => {
  console.log('Server running on port 5000')
})