import express from 'express';
import { register, login, subscribeNewsletter } from '../controller/userController.js';
import authUser, { isAuth, logout } from '../middlewares/authUser.js';

const userRouter = express.Router();

userRouter.post('/register', register)
userRouter.post('/login', login)
userRouter.get('/is-auth', authUser, isAuth)
userRouter.get('/logout', logout)
userRouter.post('/subscribe', subscribeNewsletter)

export default userRouter;


