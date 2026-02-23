import e, { Router } from 'express'
import express from 'express'
import verifyAdmin from '../../../shared/middlewares/verifyAdmin.js'
import eventEmitter from '../../../shared/EventEmiter.js'
//import verifyJwt from '../../../shared/middlewares/verifyJwt.js'

import PlanController from '../controller/PlanController.js'
import CheckoutController from '../controller/CheckoutController.js'
import ClientStripeService from '../service/ClientStripeService.js'
import { handleWebhook } from '../webhooks/StripeWebHook.js'

const planController = new PlanController()
const checkout = new CheckoutController()
const clienteService = new ClientStripeService()

const router = Router()

router.get('/plan', (req, res) => {
    res.send('Rota de planos')
})

router.post('/plan', verifyAdmin, planController.createPlan.bind(planController))
router.get('/plans', planController.findAllPlans.bind(planController))

router.post('/checkout', checkout.generateLink.bind(checkout))

router.post('/webhook/stripe', handleWebhook)

eventEmitter.on('user.created', async (user) => {
    await clienteService.createClientStripe(user.userId)
})

export default {
    router
}