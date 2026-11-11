import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import {
  ImageServiceError,
  resizeImage,
} from '../../src/services/imageService';

const imagesDirectory = path.resolve(process.cwd(), 'images');
const processedDirectory = path.join(imagesDirectory, 'processed');
const fixtureFilename = 'jasmine-service-fixture.jpg';
const fixturePath = path.join(imagesDirectory, fixtureFilename);

async function captureError(action: () => Promise<unknown>): Promise<unknown> {
  try {
    await action();
  } catch (error) {
    return error;
  }

  throw new Error('The function was expected to throw an error.');
}

describe('resizeImage', () => {
  beforeAll(async () => {
    await fs.mkdir(imagesDirectory, { recursive: true });

    await sharp({
      create: {
        width: 40,
        height: 20,
        channels: 3,
        background: '#336699',
      },
    })
      .jpeg()
      .toFile(fixturePath);
  });

  afterAll(async () => {
    await fs.rm(fixturePath, { force: true });
    await fs.rm(
      path.join(processedDirectory, 'jasmine-service-fixture-10x5.jpg'),
      { force: true }
    );
    await fs.rm(
      path.join(processedDirectory, 'jasmine-service-fixture-8x4.jpg'),
      { force: true }
    );
  });

  it('resizes an image and returns the path of the created file', async () => {
    const outputPath = await resizeImage({
      filename: fixtureFilename,
      width: 10,
      height: 5,
    });

    expect(outputPath).toBe(
      path.join(processedDirectory, 'jasmine-service-fixture-10x5.jpg')
    );

    const metadata = await sharp(outputPath).metadata();

    expect(metadata.width).toBe(10);
    expect(metadata.height).toBe(5);
  });

  it('uses .jpg when the filename does not include an extension', async () => {
    const outputPath = await resizeImage({
      filename: 'jasmine-service-fixture',
      width: 8,
      height: 4,
    });

    expect(outputPath).toBe(
      path.join(processedDirectory, 'jasmine-service-fixture-8x4.jpg')
    );
  });

  it('rejects an invalid filename', async () => {
    const error = await captureError(() =>
      resizeImage({
        filename: '../file',
        width: 10,
        height: 5,
      })
    );

    expect(error).toEqual(jasmine.any(ImageServiceError));
    expect((error as ImageServiceError).message).toBe('Invalid Filename');
    expect((error as ImageServiceError).statusCode).toBe(400);
  });

  it('rejects dimensions that are not positive integers', async () => {
    const error = await captureError(() =>
      resizeImage({
        filename: fixtureFilename,
        width: 0,
        height: 5,
      })
    );

    expect(error).toEqual(jasmine.any(ImageServiceError));
    expect((error as ImageServiceError).statusCode).toBe(400);
  });

  it('returns 404 when the original image does not exist', async () => {
    const error = await captureError(() =>
      resizeImage({
        filename: 'nonexistent-image.jpg',
        width: 10,
        height: 5,
      })
    );

    expect(error).toEqual(jasmine.any(ImageServiceError));
    expect((error as ImageServiceError).message).toBe('Image not found');
    expect((error as ImageServiceError).statusCode).toBe(404);
  });
});
