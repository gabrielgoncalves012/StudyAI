import PlanService from '../service/PlanService.js';

const planService = new PlanService();

export default class PlanController {

    async createPlan(req, res) {
        try {
            const planData = req.body;
            res.status(201).json(await newPlan.createPlan(planData));
        } catch (error) {
            res.status(500).json({ error: 'Failed to create plan', details: error.message });
        }
    }

    async findAllPlans(req, res) {
        try {
            const plans = await planService.getAllPlans();
            res.status(200).json(plans);
        } catch (error) {
            res.status(500).json({ error: 'Failed to retrieve plans', details: error.message });
        }
    }

    async returnPlanActual(req, res) {
        try {
            
            const plan = await planService.returnPlanActual(req.user_id);
            res.status(200).json(plan);

        } catch (error) {
            res.status(500).json({ error: 'Failed to retrieve plan', details: error.message });
        }
    }

}