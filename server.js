import express from 'express';
import fs from 'fs';
import path from 'path';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';
import { argv } from 'process';
// import to_table from './utils/to_table.js';

function to_table(content) {

  const rows = [];
  
  // Headers
  rows.push(['ID', 'Type', 'Chr', 'Start', 'End', 'Genes'].join('\t'));

  content.nodes.forEach(group => {
    if (!group.data || !Array.isArray(group.data.nodes)) return;

    group.data.nodes.forEach(node => {
      const id = node.id || '';
      const type = node.type || '';
      const chr = node.chr || '';
      const start = node.start || '';
      const end = node.end || '';

      // Handle genes array whether it's a string or an actual array
      let genes = node.genes;
      if (typeof genes === 'string') {
        try {
          genes = JSON.parse(genes);
        } catch {
          genes = [genes]; // fallback
        }
      }
      const genesStr = Array.isArray(genes) ? genes.join(', ') : genes;

      rows.push([id, type, chr, start, end, genesStr].join('\t'));
    });
  });

  const tsvOutput = rows.join('\n');
  return tsvOutput;
}


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

// Handle saving data to a file
app.use(bodyParser.json({ limit: '100mb' }));

app.post(`${BASE_PREFIX}/save`, (req, res) => {
  try {
  let { content } = req.body;

  const tsvOutput = to_table(content);

  fs.writeFile(galaxyOutputPath, tsvOutput, err => {
    if (err) {
      console.error('Failed to save file:', err);
      return res.status(500).json({ message: 'Failed to save file' });
    }
    res.json({ message: 'Output to file scuccessful' });
  });
  } catch (err) {
    res.status(500).json({ message: 'Internal error', error: err.message });
  }
});

// Fallback: same as app.get('', (req, res) and returns index.html for any unknown routes (SPA support)
app.use((req, res) => {
  res.sendFile(path.join(staticPath, 'index.html'));
});

app.listen(PORT, () => {});
