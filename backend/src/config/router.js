import { Router } from "express";
import { UsuarioController } from "../controller/UsuarioContorller.js";
import verify from "../middlewares/verifyJwt.js";
import { QuestoesController } from "../controller/QuestoesController.js";
import upload from "./multer.js";
import { CronogramaController } from "../controller/CronogramaController.js";

export const router = Router();

const usuarioController = new UsuarioController();
const questoesController = new QuestoesController();
const cronogramaController = new CronogramaController();

router.post('/api/usuarios', usuarioController.createUser.bind(usuarioController));
router.post('/api/usuarios/signin', usuarioController.signIn.bind(usuarioController));
router.post('/api/usuarios/verify', usuarioController.verifyEmail.bind(usuarioController));

router.post('/api/generate-question', verify, questoesController.generateQuestion.bind(questoesController));
router.get('/api/disciplines', questoesController.findAllDiscpipline.bind(questoesController));
router.post('/api/questions', questoesController.findAllTopicsByDiscipline.bind(questoesController));

router.post('/api/cronograma', verify, upload.single('file'), cronogramaController.generateCronograma.bind(cronogramaController));
router.get('/api/cronogramas', verify, cronogramaController.findAllCronogramas.bind(cronogramaController));
router.get('/api/cronograma/:id', verify, cronogramaController.findCronogramaById.bind(cronogramaController));
router.get('/api/cronograma/topico/:topicoId', verify, cronogramaController.checkTopicCompletion.bind(cronogramaController));
router.get('/api/cronograma/:id', verify, cronogramaController.editCronograma.bind(cronogramaController));
router.delete('/api/cronograma/:id', verify, cronogramaController.deleteCronograma.bind(cronogramaController));