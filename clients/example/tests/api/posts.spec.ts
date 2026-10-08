import { PostFactory } from '../../data/factories/PostFactory';
import { test, expect } from '../../fixtures';

test.describe('Posts API', () => {
  test('gets an existing post', async ({ api }) => {
    const { status, data } = await api.getPost(1);

    expect(status).toBe(200);
    expect(data).toMatchObject({
      id: 1,
      userId: expect.any(Number),
      title: expect.any(String),
      body: expect.any(String),
    });
  });

  test('creates a post', async ({ api }) => {
    const post = new PostFactory().build();

    const { status, data } = await api.createPost(post);

    expect(status).toBe(201);
    expect(data).toMatchObject({ ...post, id: expect.any(Number) });
  });

  test('returns 404 for a missing post', async ({ api }) => {
    const { status } = await api.get('/posts/999999', { expectError: true });

    expect(status).toBe(404);
  });
});
