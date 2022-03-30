const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');

describe('top-secrets routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  it('allows an authorized user to view secrets', async () => {
    const agent = request.agent(app);

    await UserService.create({
      email: 'test@example.com',
      password: 'password',
    });
    // no user
    let res = await agent.get('/api/v1/secrets');

    expect(res.status).toEqual(401);

    // logged in user
    await agent
      .post('/api/v1/auth/login')
      .send({ email: 'test@example.com', password: 'password' });
    res = await agent.get('/api/v1/secrets');

    expect(res.status).toEqual(200);
  });

  it('allows an authorized user to post secrets', async () => {
    const agent = request.agent(app);

    await agent
      .post('/api/v1/users')
      .send({ email: 'test@example.com', password: 'password' });

    await agent
      .post('/api/v1/users/sessions')
      .send({ email: 'test@example.com', password: 'password' });

    const res = await agent
      .post('/api/v1/secrets')
      .send({ title: 'secret', description: 'description' });

    expect(res.body).toEqual({
      id: expect.any(String),
      title: 'secret',
      description: 'description',
      createdAt: expect.any(String),
    });
  });
});
