import SubscriptionService from "../service/SubscriptionService.js";

export default class SubscriptionController {
    async generateLink(req, res) {
        try {

            const userId = req.user_id;
            req.body.userId = userId;
            
            const subscriptionService = new SubscriptionService();
            const response = await subscriptionService.generateLink(req.body);

            return res.status(201).json(response);

        } catch (error) {
            return res.status(500).json({
                message: 'Erro ao criar link de pagamento',
                error: error.message,
            })
        }

    }

    async getSubscriptionStatus(req, res) {
        try {
            
            const userId = req.user_id;
            const subscriptionService = new SubscriptionService();
            const response = await subscriptionService.getSubscriptionStatus(userId);

            return res.status(200).json(response);

        } catch (error) {
            return res.status(500).json({
                message: 'Erro ao obter status da assinatura',
                error: error.message,
            })
        }
    }

    async changePlan(req, res) {
        try {
            
            const userId = req.user_id;
            const newPlanId = req.body.newPlanId;
            const subscriptionService = new SubscriptionService();
            const response = await subscriptionService.changePlan(userId, newPlanId);

            return res.status(200).json(response);

        } catch (error) {
            return res.status(500).json({
                message: 'Erro ao alterar plano',
                error: error.message,
            })
        }
    }

    async cancelSubscription(req, res) {
        try {
            
            const userId = req.user_id;
            const subscriptionService = new SubscriptionService();
            const response = await subscriptionService.cancelSubscription(userId, req.params.subscriptionId);

            return res.status(200).json(response);

        } catch (error) {
            return res.status(500).json({
                message: 'Erro ao cancelar assinatura',
                error: error.message,
            })
        }
    }

    async findPlansAndInvoices(req, res) {
        try {
            
            const userId = req.user_id;
            const subscriptionService = new SubscriptionService();
            const response = await subscriptionService.findPlansAndInvoices(userId);

            return res.status(200).json(response);

        } catch (error) {
            return res.status(500).json({
                message: 'Erro ao buscar faturas',
                error: error.message,
            })
        }
    }
}