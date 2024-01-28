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






import { mocked } from 'ts-jest/utils';
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/app'; // assuming your Express app is defined in a file called 'app'

// Mock the UrlModel to avoid actual database operations
jest.mock('../models/url');
import UrlModel from '../src/models/url';

// Mock nanoid to return a predictable short URL
jest.mock('nanoid', () => {
  return {
    nanoid: jest.fn(() => 'mockedShortUrl'),
  };
});

const mockedUrlModel = mocked(UrlModel, true);

describe('URL Controller', () => {
  beforeEach(() => {
    mockedUrlModel.findOne.mockClear();
    mockedUrlModel.create.mockClear();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

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
