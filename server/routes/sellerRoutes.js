import express from 'express';
import { sellerLogin, isAuth, logout } from '../controller/sellerController.js';
import { authSeller } from '../middlewares/authSeller.js';
const sellerRouter = express.Router();
sellerRouter.post('/login', sellerLogin);
sellerRouter.post('/auth', authSeller, isAuth);
sellerRouter.post('/logout', logout);
export default sellerRouter;