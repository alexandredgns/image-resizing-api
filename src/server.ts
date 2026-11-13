import express, {
  type Application,
  type Request,
  type Response,
} from 'express';
import imageRoutes from './routes/imageRoutes';

export function createServer(): Application {
  const app = express();

  app.use(express.json());

  app.get(
    '/api/health',
    (_req: Request, res: Response): void => {
      res.status(200).json({ status: 'ok' });
    },
  );

  app.use('/api/images', imageRoutes);

  return app;
}
