import { hash } from 'bcrypt';
import { prisma } from '../config/db.js';

export class UsuarioService {

  async createUser(data) {
    console.log('Service: ', data);
    const userExists = await prisma.usuario.findUnique({ where: { email: data.email } });
    console.log(userExists);
    if (userExists != null) {
      throw new Error('Usuário já cadastrado');
    }

    console.log('Hashing password...');

    const passwordHash = await hash(data.password, 10);
    console.log('Password hashed.', passwordHash);
    data.password = passwordHash;

    return prisma.usuario.create({ data });
  }
}