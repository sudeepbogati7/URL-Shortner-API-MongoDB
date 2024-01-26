import { Request, Response } from "express";
import UrlModel from "../models/url";


const shortUrl = async (req: Request, res: Response) => {
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



const expandUrl = async (req: Request, res: Response) => {
    const { shortUrl } : { shortUrl : string} = req.body; 
    try{


    }catch(err){
        res.status(500).json({ error : "Internal Server Error !"});
    }
};




const generateShortUrl = ()=>{

    // to-do  --- edit the shorting logic here 
    const url: string= '';
    return url ; 
}