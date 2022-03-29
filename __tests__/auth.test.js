const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

describe('top-secrets routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  const mockUser = {
    email: 'test@example.com',
    password: 'password',
  };

  it('signs up a user via POST', async () => {
    const res = await request(app).post('/api/v1/auth/').send(mockUser);

    expect(res.body).toEqual({
      id: expect.any(String),
      email: 'test@example.com',
    });
  });
});
