import express from 'express';
import fs from 'fs';
import path from 'path';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';
import { argv } from 'process';
import axios from 'axios';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 4173;

const staticPath = path.join(__dirname, 'dist');
const BASE_PREFIX = '/interactivetool/ep/:token/:job_id';

const outputArgIndex = argv.indexOf('--output');
let galaxyOutputPath = null;


if (outputArgIndex !== -1 && argv.length > outputArgIndex + 1) {
  galaxyOutputPath = argv[outputArgIndex + 1];
}

// Serve static files from React's dist folder
app.use(express.static(staticPath));
// Middleware to parse JSON
app.use(express.json());

// Handle saving data to a file
app.use(bodyParser.json({ limit: '100mb' }));

app.post(`${BASE_PREFIX}/save`, async (req, res) => {
  try {
    let { content } = req.body;
    if (!content) {
      return res.status(400).json({ message: 'Missing content field' });
    } 
    const downloadUrl = `http://100.67.47.42:5500/annotation/${content}/download-tsv`;

    let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTc1MDA4MzE2MiwianRpIjoiZGM5YzlkZDctZGM2NC00MzBiLTgxMmYtYTYwOWEzZmVjNTZmIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6MTEsIm5iZiI6MTc1MDA4MzE2MiwiY3NyZiI6ImRiYTE4OGEzLTkzNGQtNGRmMC05ZWQzLTE2NDJkYzAyY2ZmZCIsImV4cCI6MTc1OTA4MzE2MiwidXNlcl9pZCI6MTEsImVtYWlsIjoidGliZXNvbG9tb243QGdtYWlsLmNvbSJ9.Sm50m91oV7HEkbEWMTJ2sxpYKL3ljBz2o3HAINCw8IQ"

    const response = await axios.get(downloadUrl, {
      responseType: 'stream',
      headers: {
        'Authorization': token,   // example header, customize as needed
        'Accept': 'text/tab-separated-values',      // example header
        // add other headers here if needed
      }
    });
    const fileStream = fs.createWriteStream(galaxyOutputPath);
    await new Promise((resolve, reject) => {
    response.data.pipe(fileStream);
    response.data.on('error', reject);
    fileStream.on('finish', resolve);
  });
  } catch (err) {
    res.status(500).json({ message: 'Internal error', error: err.message });
  }
})


// Fallback: same as app.get('', (req, res) and returns index.html for any unknown routes (SPA support)
app.use((req, res) => {
  res.sendFile(path.join(staticPath, 'index.html'));
});

app.listen(PORT, () => {});
