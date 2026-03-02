import { api, useJwtToken } from "../Api";

export class PaymentService {

    async findPlanAndFatures() {
        try {
            
            useJwtToken()
            const response = await api.get('pay/subscription/plan-and-invoices')
            return response.data

        } catch (error) {
            return {
                message: 'Error fetching fatures',
                error: error.message
            }
        }
    }

    async returnPlanActual() {
        try {
            
            useJwtToken()
            const response = await api.get('pay/plan/actual')
            return response.data

        } catch (error) {
            
            return {
                message: 'Error fetching actual plan',
                error: error.message
            }
        }
    }

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

    async checkout(data) {
        try {
            useJwtToken();
            const response = await api.post('pay/subscription/checkout', data)
            return response.data;
        } catch (error) {
            return {
                message: 'Error checking out',
                error: error.message
            }
        }
    }
}