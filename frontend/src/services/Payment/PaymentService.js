import { api } from "../Api";

export class PaymentService {
    async findAllPlans() {
        try {
            const response = await api.get('pay/plans')
            return response.data;
        } catch (error) {
            return {
                message: 'Error fetching plans',
                error: error.message
            }
        }
    }
}