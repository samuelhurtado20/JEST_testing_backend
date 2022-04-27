import Logger from './Logger.js'

import express, { json } from 'express'
import { config } from 'dotenv'
import cors from 'cors'
import morgan from 'morgan'
import { createWriteStream } from 'fs'
import { join } from 'path'
import moment from 'moment'
import TaskRoutes from './TaskRoutes.js'

const app = express()

config()

// logger with morgan
const filename = 'logs/morgan-' + moment(new Date()).format('MM-DD-YYYY') + '.log'
const accessLogStream = createWriteStream(join('./', filename), { flags: 'a' })
app.use(morgan('combined', { stream: accessLogStream }))

const corsOptions = {
  origin: 'http://localhost:' + process.env.PORT,
  optionsSuccessStatus: 200
}

// app.use(cors())  //npm i express morgan wiston dotenv cors pg moment guid --save //npm install uuid // npm i jest supertest nodemon --save-dev
// npm run test:watch ++ npm i standard -D ++ npm run lint ++ ./node_modules/.bin/eslint --init ++ npm i eslint -D ++
app.use(json())

app.use('/api/', cors(corsOptions), TaskRoutes)

//
app.use((req, res) => {
  return res.status(404).send({ message: 'Not found' })
})

const server = app.listen(process.env.PORT, () => {
  Logger.info(`server is running on port: ${process.env.IS_TEST}`)
  console.log(`server is running on port: ${process.env.PORT}`)
})

export { app, server }
