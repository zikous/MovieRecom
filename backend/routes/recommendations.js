import { Router } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const router = Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const recommendationsFilePath = path.join(__dirname, '../recommendation/recommendations.json');

router.get('/', (req, res) => {
  fs.readFile(recommendationsFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading recommendations file:', err);
      res.status(500).json({ error: 'Failed to read recommendations file' });
    } else {
      res.json(JSON.parse(data));
    }
  });
});

export default router;
