import { Router } from "express";
import { UsuarioController } from "../controller/UsuarioContorller.js";

export const router = Router();

const usuarioController = new UsuarioController();

router.post('/api/usuarios', usuarioController.createUser.bind(usuarioController));
router.post('/api/usuarios/signin', usuarioController.signIn.bind(usuarioController));