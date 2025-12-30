import express from 'express'
import cors from 'cors'
import { router } from './src/config/router.js'

const app = express()


app.use(cors({
  origin: 'http://localhost:5173', // porta do Vite
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}))
app.use(router);
// Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


const PORT = process.env.PORT || 3333
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
