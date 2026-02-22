import { Router } from 'express'
import verifyAdmin from '../../../shared/middlewares/verifyAdmin.js'
//import verifyJwt from '../../../shared/middlewares/verifyJwt.js'

import PlanController from '../controller/PlanController.js'

const planController = new PlanController()

const router = Router()

router.get('/plan', (req, res) => {
    res.send('Rota de planos')
})

router.post('/plan', verifyAdmin, planController.createPlan.bind(planController))
router.get('/plans', planController.findAllPlans.bind(planController))

export default {
    router
}