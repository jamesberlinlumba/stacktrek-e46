import express from 'express'
import morgan from 'morgan'
import router from './routes/todo.js'

const app = express()

const server = app.listen(8081, function () {
    var host = server.address().address;
    var port = server.address().port;
  
    console.log("Todolist API listening at http://%s:%s", host, port);
  })

app.get('/', function (req, res) {
  res.send('Todos API')
})

app.use(express.json())
app.use(morgan('dev'))

app.use('/api', router)