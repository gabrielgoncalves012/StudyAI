import { Router } from "express";
import { UsuarioController } from "../controller/UsuarioContorller.js";
import verify from "../middlewares/verifyJwt.js";

export const router = Router();

const usuarioController = new UsuarioController();

router.post('/api/usuarios', usuarioController.createUser.bind(usuarioController));
router.post('/api/usuarios/signin', usuarioController.signIn.bind(usuarioController));

router.get('/api/teste', verify, (req, res) => {
    res.send('Rota protegida acessada com sucesso!');
});