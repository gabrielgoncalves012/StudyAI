import { QuestoesService } from "../service/QuestoesService.js";

export class QuestoesController {
    async generateQuestion(req, res) {
        req.setTimeout(300000); // 5 minutes
        res.setTimeout(300000); // 5 minutes
        const body = req.body;
        const response = await new QuestoesService().generateQuestion(body);
        res.status(200).json(response);
    }

    async findAllTopicsByDiscipline(req, res) {
        req.setTimeout(300000); // 5 minutes
        res.setTimeout(300000); // 5 minutes
        const body = req.body;
        const response = await new QuestoesService().findAllTopicsByDiscipline(body);
        res.status(200).json(response);
    }

    async findAllDiscpipline(req, res) {
        const response = await new QuestoesService().findAllDiscpipline();
        res.status(200).json(response);
    }
}