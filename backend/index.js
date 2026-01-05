import express from 'express'
import cors from 'cors'
import { router } from './src/config/router.js'
import e from 'express'

const app = express()


app.use(cors({
  origin: 'http://localhost:5173', // porta do Vite
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(router);


const PORT = process.env.PORT || 3333
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
