import { CronogramaService } from "../service/CronogramaService.js";

export class CronogramaController {
  // Cronograma controller methods would go here
  async findAllCronogramas(req, res) {
    const user_id = req.user_id;
  
    const cronogramaService = new CronogramaService();
    const response = await cronogramaService.findAllCronogramasByUserId(user_id);
    res.status(200).json(response);
  }

  async findCronogramaById(req, res) {
    const { id } = req.params;
    const user_id = req.user_id;

    const cronogramaService = new CronogramaService();
    const response = await cronogramaService.findCronogramaById(id, user_id);
    res.status(200).json(response);
  }

  async checkTopicCompletion(req, res) {
    const { topicoId } = req.params;
    const user_id = req.user_id;

    const cronogramaService = new CronogramaService();
    
    const response = await cronogramaService.checkTopicCompletion(topicoId, user_id);
    res.status(200).json(response);
  }

  async editCronograma(req, res) {
    const { id } = req.params;
    const user_id = req.user_id;

    const cronogramaService = new CronogramaService();
    const response = await cronogramaService.editCronograma(id, req.body, user_id);
    res.status(200).json(response);
  }

  async deleteCronograma(req, res) {
    const { id } = req.params;
    const user_id = req.user_id;

    const cronogramaService = new CronogramaService();
    const response = await cronogramaService.deleteCronograma(id, user_id);
    res.status(200).json(response);
  }

  
  async generateCronograma(req, res) {

    const user_id = req.user_id;
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Nenhum arquivo PDF foi enviado'
      });
    }

    const cronogramaService = new CronogramaService();
    const response = await cronogramaService.createCronograma(req.body, req.file, user_id);
    res.status(200).json(response);//.json(response);
  }
}