import { UsuarioService } from '../service/UsuarioService.js';

export class UsuarioController {
  constructor(usuarioService) {
    this.usuarioService = new UsuarioService();
  }

  async createUser(req, res) {
    try {
      await this.usuarioService.createUser(req.body);
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

  async verifyEmail(req, res) {
    try {
      const { email, code } = req.body;
      const response = await this.usuarioService.verifyEmail(email, code);
      return res.status(200).json(response);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async aboutUser(req, res) {
    try {
      const user = await this.usuarioService.aboultUser(req.user_id);
      return res.status(200).json(user);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}