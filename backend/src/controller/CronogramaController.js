import { CronogramaService } from "../service/CronogramaService.js";

export class CronogramaController {
  // Cronograma controller methods would go here
  async findAllCronogramas(req, res) {
    const cronogramaService = new CronogramaService();
    const response = await cronogramaService.findAllCronogramasByUserId("5f2469ad-acb1-4a42-8943-1481f6d3ca8e");
    res.status(200).json(response);
  }

  async findCronogramaById(req, res) {
    const { id } = req.params;
    const cronogramaService = new CronogramaService();
    const response = await cronogramaService.findCronogramaById(id, "5f2469ad-acb1-4a42-8943-1481f6d3ca8e");
    res.status(200).json(response);
  }

  async checkTopicCompletion(req, res) {
    const { topicoId } = req.params;
    const cronogramaService = new CronogramaService();
    
    const response = await cronogramaService.checkTopicCompletion(topicoId);
    res.status(200).json(response);
  }

  async editCronograma(req, res) {
    const { id } = req.params;
    const cronogramaService = new CronogramaService();
    const response = await cronogramaService.editCronograma(id, req.body);
    res.status(200).json(response);
  }

  async deleteCronograma(req, res) {
    const { id } = req.params;
    const cronogramaService = new CronogramaService();
    const response = await cronogramaService.deleteCronograma(id);
    res.status(200).json(response);
  }

  
  async generateCronograma(req, res) {

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Nenhum arquivo PDF foi enviado'
      });
    }

    const cronogramaService = new CronogramaService();
    const response = await cronogramaService.createCronograma(req.body, req.file);
    res.status(200).json(response);//.json(response);
  }
}