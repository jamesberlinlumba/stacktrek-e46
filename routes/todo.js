import express from 'express'
import { z } from 'zod'

const router = express.Router()

const TodoSchema = z.object({
    id: z.number(),
    task: z.string(),
    completed: z.boolean()
})

let todos = [
    {
        id: 1,
        task: 'Task 1',
        completed: false
    },
    {
        id: 2,
        task: 'Task 2',
        completed: false
    },
    {
        id: 3,
        task: 'Task 3',
        completed: false
    }
]

router.get('/todos', (req, res) => {
    res.status(200).send(todos)
})

router.get('/todo/:id', (req, res) => {
    const todo = todos.find(items => items.id === Number(req.params.id))

    if (todo) {
        res.status(200).send(todo)
    }
    else {
        res.status(404).send('not found')
    }
})

router.post('/todo', (req, res) => {
    const todo = { id: new Date().getTime(), ...req.body, completed: false }

    const parsedResult = TodoSchema.safeParse(todo)
    if (!parsedResult.success) {
        return res.status(400).send(parsedResult.error)
    }

    todos = [ ...todos, todo ]
    res.status(201).send(parsedResult.data)
})

router.patch('/todo/:id', (req, res) => {
    const todoIndex = todos.findIndex(item => item.id === Number(req.params.id))

    if (todoIndex === -1) {
        return res.status(404).send('not found')
    }

    const modifiedTodo = { 'id': Number(req.params.id), ...req.body }

    const parsedResult = TodoSchema.safeParse(modifiedTodo)
    if (!parsedResult.success) {
        return res.status(400).send(parsedResult.error)
    }

    todos[todoIndex] = modifiedTodo
    res.status(201).send(parsedResult.data)
})

router.delete('/todo/:id', (req, res) => {
    const todoIndex = todos.findIndex(items => items.id === Number(req.params.id))
    
    if (todoIndex === -1) {
        return res.status(404).send('not found')
    }

    todos.splice(todoIndex, 1);
    res.status(200).send({})
})

export default router;