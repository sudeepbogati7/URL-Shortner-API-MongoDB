import * as request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/app';
import UrlModel, { Url } from '../src/models/url'; 
const nanoid = require('nanoid');
import { mocked } from 'jest-mock';
jest.mock('../src/models/url');
jest.mock('nanoid');

const mockedUrlModel = UrlModel as jest.Mocked<typeof UrlModel>;
const mockedNanoid = nanoid as jest.MockedFunction<typeof nanoid>;

beforeEach(() => {
  mockedUrlModel.findOne.mockClear();
  mockedUrlModel.create.mockClear();
  mockedNanoid.mockClear();
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

    // it('should create a new URL and return it if it does not exist', async () => {
    //   mockedUrlModel.findOne.mockResolvedValueOnce(null);
    //   mockedUrlModel.create.mockResolvedValueOnce({ originalUrl: 'http://example.com', shortUrl: 'mockedShortUrl' } as Url); // Provide type information

    //   const response = await request(app)
    //     .post('/shorten')
    //     .send({ originalUrl: 'http://example.com' })
    //     .expect(200);

    //   expect(response.body).toEqual({ shortenedUrl: { originalUrl: 'http://example.com', shortUrl: 'mockedShortUrl' } });
    // });

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
    // ... (unchanged)
  });
});
