import express from 'express'
import { isValid, z } from 'zod'
import { todoCollection } from '../db.js'
import { ObjectId } from 'mongodb'

const router = express.Router()

const TodoSchema = z.object({
    task: z.string(),
    completed: z.boolean()
})

router.get('/todos', async (req, res) => {
    const todos = await todoCollection.find().toArray()

    res.status(200).send(todos)
})

router.get('/todo/:id', async (req, res) => {
    const id = req.params.id
    if (!ObjectId.isValid(id)) return res.status(400).send('Invalid ID')
    const todo = await todoCollection.findOne({_id: new ObjectId(id)})

    if (todo) {
        res.status(200).send(todo)
    }
    else {
        res.status(404).send('Page not found')
    }
})

router.post('/todo', async (req, res) => {
    const todo = { ...req.body, completed: false }

    const parsedResult = TodoSchema.safeParse(todo)
    if (!parsedResult.success) {
        return res.status(400).send(parsedResult.error)
    }

    const { acknowledged } = await todoCollection.insertOne(parsedResult.data)
    if (!acknowledged) {
        res.status(400).send('Oooops! Something went wrong')
    }
    
    res.status(201).send('Success')
})

router.patch('/todo/:id', async (req, res) => {
    const parsedResult = TodoSchema.safeParse(req.body)
    if (!parsedResult.success) {
        return res.status(400).send(parsedResult.error)
    }

    const id = req.params.id
    if (!ObjectId.isValid(id)) return res.status(400).send('Invalid ID')
    const todo = await todoCollection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: parsedResult.data },
        { returnNewDocument: true }
    )
    
    res.status(201).send(todo)
})

router.delete('/todo/:id', async (req, res) => {
    const id = req.params.id
    if (!ObjectId.isValid(id)) return res.status(400).send('Invalid ID')
    const todo = await todoCollection.findOneAndDelete({ _id: new ObjectId(id) })

    res.status(200).send({})
})

export default router;