import { Router } from "express";
import { UsuarioController } from "../controller/UsuarioContorller.js";
import verify from "../middlewares/verifyJwt.js";
import { QuestoesController } from "../controller/QuestoesController.js";

export const router = Router();

const usuarioController = new UsuarioController();
const questoesController = new QuestoesController();

router.post('/api/usuarios', usuarioController.createUser.bind(usuarioController));
router.post('/api/usuarios/signin', usuarioController.signIn.bind(usuarioController));

router.post('/api/generate-question', verify, questoesController.generateQuestion.bind(questoesController));