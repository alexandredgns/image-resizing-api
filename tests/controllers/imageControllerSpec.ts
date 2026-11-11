import express from 'express';
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import request from 'supertest';
import { imageController } from '../../src/controllers/imageController';

const imagesDirectory = path.resolve(process.cwd(), 'images');
const processedDirectory = path.join(imagesDirectory, 'processed');
const fixtureFilename = 'jasmine-controller-fixture.jpg';
const fixturePath = path.join(imagesDirectory, fixtureFilename);

const app = express();
app.get('/api/images', imageController);

describe('imageController', () => {
    beforeAll(async () => {
        await fs.mkdir(imagesDirectory, { recursive: true });

        await sharp({
            create: {
                width: 40,
                height: 20,
                channels: 3,
                background: '#336699'
            }
        })
            .jpeg()
            .toFile(fixturePath);
    });

    afterAll(async () => {
        await fs.rm(fixturePath, { force: true });
        await fs.rm(
            path.join(processedDirectory, 'jasmine-controller-fixture-10x5.jpg'),
            { force: true }
        );
    });

    it('returns 400 when parameters are missing', async () => {
        const response = await request(app).get('/api/images');

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            error: 'Define filename, width and height.'
        });
    });

    it('returns the resized image when the parameters are valid', async () => {
        const response = await request(app)
            .get('/api/images')
            .query({
                filename: fixtureFilename,
                width: 10,
                height: 5
            });

        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toContain('image/jpeg');
    });

    it('returns 400 when a dimension is invalid', async () => {
        const response = await request(app)
            .get('/api/images')
            .query({
                filename: fixtureFilename,
                width: 'abc',
                height: 5
            });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            error: 'Width and Height must be positive integer numbers!'
        });
    });
});
