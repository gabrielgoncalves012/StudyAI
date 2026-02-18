import 'dotenv/config';
import express from 'express'
import cors from 'cors'
import routerCronogram from './src/module/cronograma/router/router.js'
//import routerPayment from './src/module/pagamento/router/router.js'

const app = express()

app.use(cors({
  origin: 'http://localhost:5173', // porta do Vite
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/', routerCronogram.router)
//app.use('/payment/', routerPayment.router)


const PORT = process.env.PORT || 3333
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
