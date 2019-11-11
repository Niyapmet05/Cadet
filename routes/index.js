import { Router } from 'express';
import freem from '../controller/userController.js';
import token from '../middleware/token';
const routes = Router();
routes.post('/auth/signup', freem.signUp);
routes.post('/auth/signin', freem.login);
/*//for testing 
routes.patch('/user/:userId', freem.changeToMentor);
routes.get('/mentors', freem.getAllMentors);
routes.get('/users', freem.getAllUsers);
routes.post('/sessions', freem.createMentoshipReq);
routes.get('/sessions', freem.getAllSessions);
routes.patch('/sessions/:sessionId/accept', freem.acceptMentorship);
routes.patch('/sessions/:sessionId/reject', freem.rejectMentorship);
// routes.patch('/sessions/:sessionId/accept', freem.acceptMentorship);*/
routes.patch('/user/:userId',token, freem.changeToMentor);
routes.get('/mentors',token, freem.getAllMentors);
routes.get('/mentors/:mentorId',token, freem.getMentor);
routes.get('/users',token, freem.getAllUsers);
routes.post('/sessions',token, freem.createMentoshipReq);
routes.patch('/sessions/:sessionId/accept',token, freem.acceptMentorship);
routes.patch('/sessions/:sessionId/reject',token, freem.rejectMentorship);
routes.get('/sessions',token, freem.getAllSessions);
routes.post('/sessions/:sessionId/review',token, freem.sessionReview);
routes.get('/sessionsReview',token, freem.getAllSessionsReview);
routes.delete('/sessionsReview/:sessionsReview',token, freem.deleteSessionsReview);

export default routes;