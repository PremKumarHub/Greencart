import express from "express";
import { addAddress, getAddress } from "../controller/addressController.js";
const addressRouter = express.Router();
addressRouter.post('/add', addAddress);
addressRouter.post('/get', getAddress);
export default addressRouter;