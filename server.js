import express from 'express';
import fs from 'fs';
import path from 'path';
import bodyParser from 'body-parser';

const app = express();
const PORT = process.env.PORT || 4173;

const __dirname = path.resolve();

// Serve static files from React's dist folder
app.use(express.static(path.join(__dirname, 'dist')));

// Handle saving data to a file
app.use(bodyParser.json());
app.post('/save', (req, res) => {
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ message: 'Missing content' });
  }

  const outputPath = path.join(__dirname, 'output.txt');
  fs.writeFile(outputPath, content, err => {
    if (err) {
      console.error('Failed to save file:', err);
      return res.status(500).json({ message: 'Failed to save file' });
    }
    res.json({ message: 'Saved successfully' });
  });
});

// Fallback: return index.html for any unknown routes (SPA support)
// app.get('', (req, res) => {
//   res.sendFile(path.join(__dirname, 'dist/index.html'));
// });

app.use((req, res) => {
  res.sendFile(path.resolve(__dirname, 'dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
