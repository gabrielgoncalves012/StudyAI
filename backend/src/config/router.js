import { Router } from "express";
import { UsuarioController } from "../controller/UsuarioContorller.js";

export const router = Router();

router.get('', (req, res) => {
  res.json({ message: 'Express server is running 🚀' })
});

const usuarioController = new UsuarioController();

router.post('/api/usuarios', usuarioController.createUser.bind(usuarioController));