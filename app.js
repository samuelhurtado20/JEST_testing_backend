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
  optionsSuccessStatus: 200,
}
//
app.set('pass', process.env.PGPASSWORD_TEST)

//app.use(cors())  //npm i express morgan wiston dotenv cors pg moment guid --save //npm install uuid // npm i jest supertest nodemon --save-dev
app.use(json())

app.use('/api/', cors(corsOptions), TaskRoutes)

export default app
