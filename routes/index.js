import { Router } from 'express';
import freem from '../controller/userController.js';
const routes = Router();
routes.post('/auth/signup', freem.signUp);
routes.post('/auth/signin', freem.login);
routes.patch('/user/:userId', freem.changeToMentor);

export default routes;