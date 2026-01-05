import { CronogramaService } from "../service/CronogramaService.js";

export class CronogramaController {
  // Cronograma controller methods would go here
  constructor(cronogramaService) {
    this.cronogramaService = new CronogramaService();
  }
}