import express from 'express';
import fs from 'fs';
import path from 'path';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';
import { argv } from 'process';
import axios from 'axios';

import AdmZip from 'adm-zip';
const TEMP_ZIP_PATH = path.join('./', 'downloaded.zip'); // adjust path as needed


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 4173;

const staticPath = path.join(__dirname, 'dist');
const BASE_PREFIX = '/interactivetool/ep/:token/:job_id';

// const outputArgIndex = argv.indexOf('--output');
const output1Index = argv.indexOf('--output');
const output2Index = argv.indexOf('--output2');

let galaxyOutputPaths = [null, null];

if (output1Index !== -1 && argv.length > output1Index + 1) {
  galaxyOutputPaths[0] = argv[output1Index + 1];
}

if (output2Index !== -1 && argv.length > output2Index + 1) {
  galaxyOutputPaths[1] = argv[output2Index + 1];
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
    // const fileStream = fs.createWriteStream(galaxyOutputPath);
    const fileStream = fs.createWriteStream(TEMP_ZIP_PATH);
    await new Promise((resolve, reject) => {
    response.data.pipe(fileStream);
    response.data.on('error', reject);
    fileStream.on('finish', resolve);
  });

    // Extract the ZIP
  const zip = new AdmZip(TEMP_ZIP_PATH);
  const zipEntries = zip.getEntries();
  let fileIndex = 0;

    for (const entry of zipEntries) {
      console.log({entry: entry.entryName});
    if (entry.entryName.endsWith('.tsv') && fileIndex < 2) {
      const tsvContent = zip.readAsText(entry);
      if (galaxyOutputPaths[fileIndex]) {
        fs.writeFileSync(galaxyOutputPaths[fileIndex], tsvContent, 'utf8');
        // console.log(`✅ Wrote ${entry.entryName} to ${galaxyOutputPaths[fileIndex]} - server.js:81`);
      }
      fileIndex++;
    }
  }

  res.status(200).json({ message: 'TSV files extracted and logged' });
  } catch (err) {
    res.status(500).json({ message: 'Internal error', error: err.message });
  }
})


// Fallback: same as app.get('', (req, res) and returns index.html for any unknown routes (SPA support)
app.use((req, res) => {
  res.sendFile(path.join(staticPath, 'index.html'));
});

app.listen(PORT, () => {}); 
