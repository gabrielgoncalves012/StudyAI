export class CronogramaService {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async getAllCronogramas() {
    return this.prisma.cronograma.findMany();
  }

  
}