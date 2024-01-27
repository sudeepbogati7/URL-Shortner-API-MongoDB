import { describe, expect, test, beforeEach, afterEach } from '@jest/globals';
import request from 'supertest';
import app from '../src/app';
let server: any;
describe("URL shortener API ", () => {
  beforeEach(() => {
    server = app.listen(3000);

  });
  afterEach((done) => {
    server.close(done);
  })
  it("should shorten a URL ", async () => {
    const res = await request(server)
      .post('/api/shorten')
      .send({ originalUrl: 'https://www.example-of-original-url.com' });
    expect(res.status).toBe(201);
    // expect(res.body).toHaveProperty('originalUrl','https://example-of-original-url.com');
    // expect(res.body).toHaveProperty('shortUrl');
  });

  // it('should expand a short URL' , async() => {
  //     // to do ---
  // });
});
