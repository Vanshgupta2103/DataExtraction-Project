const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(express.static('public')); // Serve static files from the public directory

app.post('/process-pdf', upload.single('pdf'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const tempFilePath = req.file.path;
  const newFileName = uuidv4() + '.pdf';
  const newFilePath = path.join(__dirname, 'processed', newFileName);

  console.log(`Temporary file path: ${tempFilePath}`);
  console.log(`New file path: ${newFilePath}`);

  // Dummy processing step: just copy the file
  fs.copyFile(tempFilePath, newFilePath, (err) => {
    if (err) {
      console.error(`Error copying file: ${err.message}`);
      return res.status(500).json({ error: 'Error processing file' });
    }

    // Respond with the download URL
    res.json({ downloadUrl: `/processed/${newFileName}` });
  });
});

// Serve the processed files
app.use('/processed', express.static(path.join(__dirname, 'processed')));

const PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:5500`);
});
