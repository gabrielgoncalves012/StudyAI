import express from 'express'
import cors from 'cors'

const app = express()


app.use(cors({
  origin: 'http://localhost:5173', // porta do Vite
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}))

// Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


app.get('/', (req, res) => {
  res.json({ message: 'Express server is running 🚀' })
})


const PORT = process.env.PORT || 3333
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
