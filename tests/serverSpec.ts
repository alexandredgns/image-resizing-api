import request from 'supertest';
import { createServer } from '../src/server';

describe('GET /api/health', () => {
  const app = createServer();

  it('returns status 200, API is working', async () => {
    const response = await request(app).get('/api/health');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok' });
  });
});
