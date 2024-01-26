import { Request, Response } from "express";
import UrlModel from "../models/url";
const { nanoid } = require('nanoid');

interface ShortenUrlRequest extends Request {
    body : {
        originalUrl : string; 
    }
}

interface ExpandUrlRequest extends Request {
    params : {
        shortUrl : string; 
    };
}


const shortenUrl = async (req: ShortenUrlRequest, res: Response) => {
    try{
        const { originalUrl }: { originalUrl: string } = req.body;
    
        const existingUrl = await UrlModel.findOne({ originalUrl });
        //if the url already exists
        if (existingUrl) {
            res.status(200).json(existingUrl);
        }else{
            const shortUrl : string = generateShortUrl();
            const newUrl = await UrlModel.create({ originalUrl , shortUrl});
            res.status(200).json({ shortenedUrl : newUrl});
        }
    }catch(err){
        res.status(500).json({ error : "Internal Server Error "});
    }
};


// expanding the url 
const expandUrl = async (req: ExpandUrlRequest, res: Response) => {
    const { shortUrl } : { shortUrl : string} = req.params; 
    try{
        const existingUrl = await UrlModel.findOne({ shortUrl});
        if(existingUrl){
            res.redirect(existingUrl.originalUrl);
        }else{
            res.status(404).json({ error : "No short URL found ..."});
        }
    }catch(err){
        res.status(500).json({ error : "Internal Server Error !"});
    }
};


// nanoid module mechanism to short the actual url 
const generateShortUrl = (): string =>{
    return nanoid(6);
}

export { shortenUrl , expandUrl };