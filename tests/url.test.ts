// import { describe, expect, test, beforeEach, afterEach } from '@jest/globals';
// import request from 'supertest';
// import app from '../src/app';
// let server: any;
// describe("URL shortener API ", () => {
//   beforeEach(() => {
//     server = app.listen(3000);

//   });
//   afterEach((done) => {
//     server.close(done);
//   })
//   it("should shorten a URL ", async () => {
//     const res = await request(server)
//       .post('/api/shorten')
//       .send({ originalUrl: 'https://www.example-of-original-url.com' });
//     expect(res.status).toBe(201);
//     // expect(res.body).toHaveProperty('originalUrl','https://example-of-original-url.com');
//     // expect(res.body).toHaveProperty('shortUrl');
//   });

//   // it('should expand a short URL' , async() => {
//   //     // to do ---
//   // });
// });
//=========================================================================================================================




import { mocked } from 'jest-mock';
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/app';
import UrlModel from '../src/models/url';



jest.mock('../models/url');
jest.mock('nanoid', () => ({
  nanoid: jest.fn(() => 'mockedShortUrl'),
}));

const mockedUrlModel = mocked(UrlModel,{shallow:false}));

beforeEach(() => {
  mockedUrlModel.findOne.mockClear();
  mockedUrlModel.create.mockClear();
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('URL Controller', () => {
  describe('Shorten URL', () => {
    it('should return existing URL if it already exists', async () => {
      mockedUrlModel.findOne.mockResolvedValueOnce({ originalUrl: 'http://example.com', shortUrl: 'existingShortUrl' });

      const response = await request(app)
        .post('/shorten')
        .send({ originalUrl: 'http://example.com' })
        .expect(200);

      expect(response.body).toEqual({ shortenedUrl: { originalUrl: 'http://example.com', shortUrl: 'existingShortUrl' } });
    });

    it('should create a new URL and return it if it does not exist', async () => {
      mockedUrlModel.findOne.mockResolvedValueOnce(null);
      mockedUrlModel.create.mockResolvedValueOnce({ originalUrl: 'http://example.com', shortUrl: 'mockedShortUrl' });

      const response = await request(app)
        .post('/shorten')
        .send({ originalUrl: 'http://example.com' })
        .expect(200);

      expect(response.body).toEqual({ shortenedUrl: { originalUrl: 'http://example.com', shortUrl: 'mockedShortUrl' } });
    });

    it('should handle internal server error', async () => {
      mockedUrlModel.findOne.mockRejectedValueOnce('Internal Server Error');

      const response = await request(app)
        .post('/shorten')
        .send({ originalUrl: 'http://example.com' })
        .expect(500);

      expect(response.body).toEqual({ error: 'Internal Server Error ' });
    });
  });

  describe('Expand URL', () => {
    it('should redirect to the original URL if the short URL exists', async () => {
      mockedUrlModel.findOne.mockResolvedValueOnce({ originalUrl: 'http://example.com', shortUrl: 'existingShortUrl' });

      await request(app)
        .get('/expand/existingShortUrl')
        .expect(302) // Redirect status
        .expect('Location', 'http://example.com');
    });

    it('should return 404 if the short URL does not exist', async () => {
      mockedUrlModel.findOne.mockResolvedValueOnce(null);

      const response = await request(app)
        .get('/expand/nonExistingShortUrl')
        .expect(404);

      expect(response.body).toEqual({ error: 'No short URL found ...' });
    });

    it('should handle internal server error', async () => {
      mockedUrlModel.findOne.mockRejectedValueOnce('Internal Server Error');

      const response = await request(app)
        .get('/expand/errorShortUrl')
        .expect(500);

      expect(response.body).toEqual({ error: 'Internal Server Error !' });
    });
  });
});