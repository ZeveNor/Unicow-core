const configJSON = require('./config/config.json');
const express = require('express');
const path = require('path');
const app = express();
const port = 4200;

require('dotenv').config({
  override: true,
  path: path.join(__dirname, `${configJSON.dev_mode}.env`)
});

app.use(express.json());
app.use('/api/students', require('./routes/studentRoutes'));

app.get('/', (req, res) => {
  res.send('Ping Pong!!!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
