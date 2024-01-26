import {describe, expect, test} from '@jest/globals';
import request from 'supertest';
import app from '../src/app';

describe("URL shortener API ", () => {
    it("should shorten a URL ", async() => {
        const res = await request(app)
            .post('/api/shorten')
            .send({originalUrl : 'https://www.example-of-original-url.com'});

        expect(res.status).toBe(201);
        // expect(res.body).toHaveProperty('originalUrl','https://example-of-original-url.com');
        // expect(res.body).toHaveProperty('shortUrl');
    });

    // it('should expand a short URL' , async() => {
    //     // to do ---
    // });
});