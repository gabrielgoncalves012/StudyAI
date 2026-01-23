import { CronogramaService } from "../service/CronogramaService.js";

export class CronogramaController {
  // Cronograma controller methods would go here
  async generateCronograma(req, res) {


    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Nenhum arquivo PDF foi enviado'
      });
    }

    console.log(req.file.originalname)
    console.log(req.body);

    const cronogramaService = new CronogramaService();
    const response = await cronogramaService.createCronograma(req.body, req.file);
    res.status(200).json(response);//.json(response);
  }
}