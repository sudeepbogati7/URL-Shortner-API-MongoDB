    import * as express from'express';
const router = express.Router();
import { shortenUrl, expandUrl } from '../controllers/urlController';

router.post('/shorten',shortenUrl);
router.get('/expand/:shortUrl', expandUrl);

export default router; 

