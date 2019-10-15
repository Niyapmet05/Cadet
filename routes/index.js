import { Router } from 'express';
import freem from '../controller/userController.js';
const routes = Router();
routes.post('/', freem.signUp);
export default routes;