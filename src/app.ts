import express, { Express, Request, Response, NextFunction } from "express";
import * as bodyparser from "body-parser"
import cors from 'cors';
import urlRoutes from './routes/urlRoutes';

class App {
    public express : Express;
    constructor(){
        this.express = express();
        this.middlewares();
        this.routes();
    }

    private middlewares() : void {
        this.express.use(cors());
        this.express.use(bodyparser.json());
    }

    private routes() : void {
        this.express.use('/api', urlRoutes);
    }


}


export default new App().express; 