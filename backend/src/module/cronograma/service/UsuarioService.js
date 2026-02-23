import dotenv from 'dotenv';

import { hash, compare } from 'bcrypt';
import { prisma } from '../../../shared/config/db.js';
import jwt from 'jsonwebtoken';
import { EmailService } from './EmailService.js';
import eventEmitter from '../../../shared/EventEmiter.js';


export class UsuarioService {

  async createUser(data) {

    const userExists = await prisma.usuario.findUnique({ where: { email: data.email } });
    if (userExists != null) {
      throw new Error('Usuário já cadastrado');
    }


    const passwordHash = await hash(data.password, 10);
    data.password = passwordHash;

    const user = await prisma.usuario.create({ data });

    const emailService = new EmailService();
    emailService.sendMessageVerification(data.email, user.id);

    return { ok: true };
  }

  async signIn(data) {
    const user = await prisma.usuario.findUnique({ where: { email: data.email } });
    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    if (!user.verified) {
      throw new Error('Usuário ainda nao verificado');
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

  async verifyEmail(email, code) {
    const record = await prisma.verificationToken.findUnique({
      where: {
        email: email,
        codigo: code,
        
        expiresAt: {
          gt: new Date()
        }
      }
    });

    if (!record) {
      throw new Error('Código de verificação inválido ou expirado');
    }

    var tentativas = record.tentativas + 1;

    await prisma.verificationToken.update({
      where: { id: record.id },
      data: { tentativas: tentativas }
    });

    if (record.tentativas >= 5) {
      throw new Error('Tentativas de verificação excedidas');
    }

    await prisma.usuario.update({
      where: { id: record.userId },
      data: { verified: true }
    });

    await prisma.verificationToken.deleteMany({
      where: { userId: record.userId }
    });

    await prisma.usage.create({
      data: {
        userId: record.userId,
        periodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });

    eventEmitter.emit('user.created', { userId: record.userId });

    return { message: 'Email verificado com sucesso' }
  }
}