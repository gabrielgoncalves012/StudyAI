import { UsuarioService } from '../service/UsuarioService.js';

export class UsuarioController {
  constructor(usuarioService) {
    this.usuarioService = new UsuarioService();
  }

  async createUser(req, res) {
    try {
      console.log('Controller: ', req.body);
      await this.usuarioService.createUser(req.body);
      console.log('User created successfully.');
      return res.status(201).json({ message: 'Usuário criado com sucesso' });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async signIn(req, res) {
    try {
      const user = await this.usuarioService.signIn(req.body);
      return res.status(200).json(user);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}