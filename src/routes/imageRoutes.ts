import { Router } from 'express';
import { imageController } from '../controllers/imageController';

const imageRoutes = Router();

imageRoutes.get('/', imageController);

export default imageRoutes;