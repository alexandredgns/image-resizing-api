import type { Request, RequestHandler, Response } from 'express';
import { ImageServiceError, resizeImage } from '../services/imageService';

export const imageController: RequestHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { filename, width, height } = req.query;

  if (
    typeof filename !== 'string' ||
    typeof width !== 'string' ||
    typeof height !== 'string'
  ) {
    res.status(400).json({
      error: 'Define filename, width and height.',
    });
    return;
  }

  try {
    const imagePath = await resizeImage({
      filename,
      width: Number(width),
      height: Number(height),
    });

    res.sendFile(imagePath);
  } catch (error: unknown) {
    if (error instanceof ImageServiceError) {
      res.status(error.statusCode).json({ error: error.message });
      return;
    }

    console.error(error);
    res.status(500).json({ error: 'Image processing error' });
  }
};
