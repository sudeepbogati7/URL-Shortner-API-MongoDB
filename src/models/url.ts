import mongoose , { Document , Schema, mongo } from "mongoose";

interface Url extends Document {
    originalUrl : string; 
    shortUrl : string; 
}

const urlSchema = new Schema <Url>({
        originalUrl : {
            type : String, 
            required: true, 
            unique : true, 
        },
        shortUrl : {
            type : String,
            required: true, 
            unique : true, 
        },
}, { timestamps : true}); 

const UrlModel = mongoose.model<Url>('Url', urlSchema);

export default UrlModel ; 