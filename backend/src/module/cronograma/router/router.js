import { Router } from "express";

import verify from "../../../shared/middlewares/verifyJwt.js";
import { checkUsage } from "../../../shared/middlewares/checkUsage.js";
import upload from "../utils/multer.js";
import { QuestoesController } from "../controller/QuestoesController.js";
import { UsuarioController } from "../controller/UsuarioContorller.js";
import { CronogramaController } from "../controller/CronogramaController.js";

const router = Router();

const usuarioController = new UsuarioController();
const questoesController = new QuestoesController();
const cronogramaController = new CronogramaController();

router.post('/api/usuarios', usuarioController.createUser.bind(usuarioController));
router.post('/api/usuarios/signin', usuarioController.signIn.bind(usuarioController));
router.post('/api/usuarios/verify', usuarioController.verifyEmail.bind(usuarioController));

router.post('/api/generate-question', verify, checkUsage("questoes"), questoesController.generateQuestion.bind(questoesController));
router.get('/api/disciplines', questoesController.findAllDiscpipline.bind(questoesController));
router.post('/api/questions', questoesController.findAllTopicsByDiscipline.bind(questoesController));

router.post('/api/cronograma', verify, checkUsage("cronogramas"), upload.single('file'), cronogramaController.generateCronograma.bind(cronogramaController));
router.get('/api/cronogramas', verify, checkUsage("acessCronograma"), cronogramaController.findAllCronogramas.bind(cronogramaController));
router.get('/api/cronograma/:id', verify, checkUsage("acessCronograma"), cronogramaController.findCronogramaById.bind(cronogramaController));
router.get('/api/cronograma/topico/:topicoId', verify, checkUsage("acessCronograma"), cronogramaController.checkTopicCompletion.bind(cronogramaController));
router.get('/api/cronograma/:id', verify, checkUsage("acessCronograma"), cronogramaController.editCronograma.bind(cronogramaController));
router.delete('/api/cronograma/:id', verify, checkUsage("acessCronograma"), cronogramaController.deleteCronograma.bind(cronogramaController));

export default  {
    router
}