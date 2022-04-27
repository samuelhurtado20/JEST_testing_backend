import { v4 as uuidv4, validate as uuidValidate } from 'uuid'
import pool from './database.js'
import Logger from './Logger.js'

class TaskController {
  static GetById = async (req, res) => {
    try {
      const id = req.params.id
      if (!uuidValidate(id)) return res.status(400).send({ message: 'Task Not Found' })

      const result = await pool.query('SELECT id, name, detail FROM public.tasks where id = $1', [id])
      if (result.rows.length < 1) return res.status(404).send(result.rows)
      return res.status(200).send(result.rows)
    } catch (e) {
      Logger.error(`${e.status || 500} - ${e.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`)
      return res.status(500).send({ message: 'Unexpected Error' })
    }
  }

  static Create = async (req, res) => {
    try {
      const { name, detail } = req.body
      const id = uuidv4()

      if (!uuidValidate(id) || !name || !detail) return res.status(400).send({ message: 'Invalid Information' })

      const result = await pool.query('insert into public.tasks (id, name, detail) values ($1, $2, $3) RETURNING id', [id, name, detail])
      return res.status(201).send(result.rows)
    } catch (e) {
      Logger.error(`${e.status || 500} - ${e.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`)
      return res.status(500).send({ message: 'Unexpected Error' })
    }
  }

  static Update = async (req, res) => {
    try {
      const { id, name, detail } = req.body

      if (!uuidValidate(id) || !name || !detail) return res.status(400).send({ message: 'Invalid Information' })

      const result = await pool.query('update public.tasks set name = $1, detail = $2 where id = $3 RETURNING id', [name, detail, id])
      return res.status(200).send(result.rows)
    } catch (e) {
      Logger.error(`${e.status || 500} - ${e.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`)
      return res.status(500).send({ message: 'Unexpected Error' })
    }
  }

  static Delete = async (req, res) => {
    try {
      const id = req.params.id
      if (!uuidValidate(id)) return res.status(400).send({ message: 'Task Not Found' })

      const task = await pool.query('SELECT id, name, detail FROM public.tasks where id = $1', [id])
      if (task.rows.length < 1) return res.status(404).send(task.rows)

      const result = await pool.query('delete from public.tasks where id = $1', [id])
      return res.status(200).send(result)
    } catch (e) {
      Logger.error(`${e.status || 500} - ${e.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`)
      return res.status(500).send({ message: 'Unexpected Error' })
    }
  }

  static DeleteAll = async (req, res) => {
    try {
      const result = await pool.query('delete from public.tasks')
      return res.status(200).send(result)
    } catch (e) {
      Logger.error(`${e.status || 500} - ${e.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`)
      return res.status(500).send({ message: 'Unexpected Error' })
    }
  }

  static List = async (req, res) => {
    try {
      const result = await pool.query('SELECT id, name, detail FROM public.tasks')
      return res.status(200).send(result.rows)
    } catch (e) {
      Logger.error(`${e.status || 500} - ${e.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`)
      return res.status(500).send({ message: 'Unexpected Error' })
    }
  }
}

export default TaskController
