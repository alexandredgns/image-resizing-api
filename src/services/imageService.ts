import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

export class ImageServiceError extends Error {
    constructor(
        message: string,
        public statusCode: number
    ) {
        super(message);
        this.name = 'ImageServiceError';
    }
}

interface ResizeImageOptions {
    filename: string;
    width: number;
    height: number;
}

const imagesDirectory = path.resolve(process.cwd(), 'images');
const processedDirectory = path.join(imagesDirectory, 'processed');


export async function resizeImage({
    filename,
    width,
    height
}: ResizeImageOptions): Promise<string> {
    if (!/^[\w-]+(?:\.(?:jpe?g|png|webp))?$/i.test(filename)) {
    throw new ImageServiceError('Invalid Filename', 400);
  }

  if(!Number.isInteger(width) || width <= 0 ||
     !Number.isInteger(height) || height <= 0) {
        throw new ImageServiceError(
            'Width and Height must be positive integer numbers!', 400
        );
    }

  const hasExtension = path.extname(filename) !== '';
  const sourceFilename = hasExtension ? filename : `${filename}.jpg`;
  const sourcePath = path.join(imagesDirectory, sourceFilename)

  try {
    await fs.access(sourcePath);
  } catch {
    throw new ImageServiceError('Image not found', 404);
  }

  const parsedName = path.parse(sourceFilename);
  const outputFilename = 
    `${parsedName.name}-${width}x${height}${parsedName.ext}`;
  const outputPath = path.join(processedDirectory, outputFilename);

  await fs.mkdir(processedDirectory, { recursive: true });

  try {
    await fs.access(outputPath);
  } catch {
    await sharp(sourcePath)
        .resize({ width, height })
        .toFile(outputPath);
  }

  return outputPath;
}
