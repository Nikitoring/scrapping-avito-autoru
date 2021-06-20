import cors from 'cors'
import cookieParser from 'cookie-parser'
import express from 'express'
import { port } from './config.js'
import path from 'path'
import logger from 'morgan'
import Cars from './src/avito.js'

;(async () => {
  const app = express()
  // CORS configuration
  const corsOptions = {
    origin: 'http://0.0.0.0:5000',
    credentials: true,
  }
  app.set('view engine', 'pug')
  app.use(logger('dev'))
  app.use(cors(corsOptions))
  app.use(cookieParser())
  // app.use(express.static(path.join(__dirname, 'public')))
  app.get('/', (_req,res) => {
    // res.send('Server Run')
    res.render('index', { title: 'Avito'})
  }
  )

  app.get('/avito', async (req, res) => {
    const cars = await Cars.getCars()
    res.json(cars)
  })

  app.listen(port, () => {
    console.log(
      `Server listening http://localhost:${port}`
    )
  })
})()