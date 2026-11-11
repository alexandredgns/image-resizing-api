import express, { type Application } from 'express';
import imageRoutes from './routes/imageRoutes';

export function createServer(): Application {
    const app = express();

    app.use(express.json());

    app.get('/api/health', (_req, res) => {
        res.status(200).json({status: 'ok'});
    });

    app.use('/api/images', imageRoutes);

    return app;
}
