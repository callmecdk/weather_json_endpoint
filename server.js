const express = require('express');
const csvParser = require('csv-parser');
const fs = require('fs');
const cors = require('cors')
const app = express();
const port = 5000;

app.use(express.json());
app.use(cors());

let data = [];

// Read the CSV file with UTF-8 encoding and convert it into JSON
fs.readFile('./data/Melbourne_Temperature.csv', 'utf8', (err, content) => {
  if (err) {
    console.error('Error reading CSV file:', err);
    return;
  }

  // Strip BOM character (if present) from the content
  const csvContent = content.replace(/^\uFEFF/, '');
  // Parse the CSV content and convert it into JSON
  csvParser({ mapHeaders: ({ header }) => header.trim() })
    .on('data', (row) => {
      // console.log(row['Date'])
      data.push(row);
    })
    .on('end', () => {
      console.log('CSV file successfully processed.');
    })
    .write(csvContent);
});

app.get('/api/weather', (_, res) => {
  res.json(data);
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});