import { Router } from 'express'
import TaskController from './TaskController.js'
const TaskRoutes = Router()

TaskRoutes.get('/', TaskController.List)
TaskRoutes.get('/:id', TaskController.GetById)
TaskRoutes.post('/', TaskController.Create)
TaskRoutes.put('/', TaskController.Update)
TaskRoutes.delete('/:id', TaskController.Delete)
TaskRoutes.delete('/', TaskController.DeleteAll)

export default TaskRoutes
