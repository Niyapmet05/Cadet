import { Router } from 'express';
import freem from '../controller/appController.js';
const routes = Router();
routes.get('/', freem.signUp);
export default routes;