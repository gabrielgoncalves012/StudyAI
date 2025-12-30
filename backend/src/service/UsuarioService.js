export class UsuarioService {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async getAllUsers() {
    return this.prisma.usuario.findMany();
  }

  
}