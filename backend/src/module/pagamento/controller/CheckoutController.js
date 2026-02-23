import CheckoutService from "../service/CheckoutService.js";

export default class CheckoutController {
    async generateLink(req, res) {
        try {
            
            const checkoutService = new CheckoutService();
            const response = await checkoutService.generateLink(req.body);

            return res.status(201).json(response);

        } catch (error) {
            return res.status(500).json({
                message: 'Erro ao criar link de pagamento',
                error: error.message,
            })
        }

    }
}