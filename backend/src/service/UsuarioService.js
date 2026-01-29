import dotenv from 'dotenv';

import { hash, compare } from 'bcrypt';
import { prisma } from '../config/db.js';
import jwt from 'jsonwebtoken';
//import e from 'express';

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

  async signIn(data) {
    const user = await prisma.usuario.findUnique({ where: { email: data.email } });
    if (!user) {
      throw new Error('Usuário não encontrado');
    }
    
    const passwordMatch = await compare(data.password, user.password);
    if (!passwordMatch) {
      throw new Error('Senha incorreta');
    }

    var SECRET_KEY = process.env.SECRET_KEY;

    const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: '30d' });

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      nome: user.nome,
      token: token
    };

  }
}