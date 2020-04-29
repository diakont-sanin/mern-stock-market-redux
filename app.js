const express = require ('express')
const mongoose = require ('mongoose')
const path = require ('path')
const cors = require ('cors')
const bodyParser = require ('body-parser')
const morgan = require ('morgan')
const config = require ('config')

// routes
const authRoutes = require ('./routes/api/auth')
const userRoutes = require ('./routes/api/users')
const watchList = require ('./routes/api/watchlist')
const holdList = require ('./routes/api/holdlist')
const indexes = require ('./routes/api/indexes')
const cash = require ('./routes/api/cash')
const total = require ('./routes/api/total')

const app = express()

// CORS Middleware
app.use(cors())
// Logger Middleware
app.use(morgan('dev'))
// Bodyparser Middleware
app.use(bodyParser.json())

// DB Config
const db = config.get('mongoURI')

// Connect to Mongo
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  }) // Adding new mongo url parser
  .then(() => console.log('MongoDB Connected...'))
  .catch((err) => console.log(err))

// Use Routes
app.use('/api/watchlist', watchList)
app.use('/api/holdlist', holdList)
app.use('/api/users', userRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/indexes', indexes)
app.use('/api/cash', cash)
app.use('/api/total', total)

// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'))

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  })
}

module.exports = app
