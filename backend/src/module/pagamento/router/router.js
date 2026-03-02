import e, { Router } from 'express'
import express from 'express'
import verifyAdmin from '../../../shared/middlewares/verifyAdmin.js'
import eventEmitter from '../../../shared/EventEmiter.js'
import verifyJwt from '../../../shared/middlewares/verifyJwt.js'

import PlanController from '../controller/PlanController.js'
import SubscriptionController from '../controller/SubscriptionController.js'
import ClientStripeService from '../service/ClientStripeService.js'
import { handleWebhook } from '../webhooks/StripeWebHook.js'

const planController = new PlanController()
const subscriptionController = new SubscriptionController()
const clienteService = new ClientStripeService()

const router = Router()

router.get('/plan', (req, res) => {
    res.send('Rota de planos')
})

router.post('/plan', verifyAdmin, planController.createPlan.bind(planController))
router.get('/plans', planController.findAllPlans.bind(planController))
router.get('/plan/actual', verifyJwt, planController.returnPlanActual.bind(planController))

router.post('/subscription/checkout', verifyJwt, subscriptionController.generateLink.bind(subscriptionController))
router.get('/subscription/status', verifyJwt, subscriptionController.getSubscriptionStatus.bind(subscriptionController))
router.post('/subscription/plan', verifyJwt, subscriptionController.changePlan.bind(subscriptionController))
router.post('/subscription/cancel', verifyJwt, subscriptionController.cancelSubscription.bind(subscriptionController))
router.get('/subscription/plan-and-invoices', verifyJwt, subscriptionController.findPlansAndInvoices.bind(subscriptionController))

router.post('/webhook/stripe', handleWebhook)

eventEmitter.on('user.created', async (user) => {
    await clienteService.createClientStripe(user.userId)
})

export default {
    router
}