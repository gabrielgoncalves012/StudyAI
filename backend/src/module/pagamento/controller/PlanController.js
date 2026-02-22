import PlanService from '../service/PlanService.js';

export default class PlanController {

    async createPlan(req, res) {
        try {
            const planData = req.body;
            const newPlan = new PlanService();
            res.status(201).json(await newPlan.createPlan(planData));
        } catch (error) {
            res.status(500).json({ error: 'Failed to create plan', details: error.message });
        }
    }

}