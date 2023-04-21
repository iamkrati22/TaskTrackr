const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
const PORT = 8000;
const dbService = require('./dbService');
const ejs = require('ejs');
const fileUpload = require('express-fileupload');
dotenv.config();

app.use(express.static('public'));
// Set the view engine to ejs
app.set('view engine', 'ejs');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(fileUpload());

// Route to handle file upload
app.post('/upload', (req, res) => {
  if (!req.files || !req.files.image) {
    return res.status(400).send('No image uploaded');
  }

  const image = req.files.image;
  const id = req.body.id;

  // Save the image to the database
  const db = dbService.getDbServiceInstance();
  const result = db.saveImage(id, image);

  result
    .then((data) => {
      res.redirect('/');
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).send(err);
    });
});

// Create
app.post('/insert', (request, response) => {
  console.log(request.body);
  const { name } = request.body;
  const db = dbService.getDbServiceInstance();
  console.log(name);
  const result = db.insertNewName(name);

  result
    .then((data) => response.json({ data: data }))
    .catch((err) => console.log(err));
});

// Read
app.get('/', async (req, res) => {
  const db = dbService.getDbServiceInstance();
  const result = await db.getAllData();

  const data = result.rows;
  res.render('pages/index', { data });
});

app.get('/get', async (req, res) => {
  const db = dbService.getDbServiceInstance();

  const result = db.getAllData();

  result
    .then((data) => res.json({ data: data }))
    .catch((err) => console.log(err));
});

app.get('/search/:name', (request, response) => {
  const { name } = request.params;
  const db = dbService.getDbServiceInstance();

  const result = db.searchByName(name);

  result
    .then((data) => response.json({ data: data }))
    .catch((err) => console.log(err));
});

// Update
app.patch('/update', (request, response) => {
  const { id, name } = request.body;
  const db = dbService.getDbServiceInstance();

  const result = db.updateNameById(id, name);

  result
    .then((data) => response.json({ success: data }))
    .catch((err) => console.log(err));
});

// Delete
app.delete('/delete/:id', (request, response) => {
  const { id } = request.params;
  const db = dbService.getDbServiceInstance();

  const result = db.deleteRowById(id);

  result
    .then((data) => response.json({ success: data }))
    .catch((err) => console.log(err));
});

app.listen(PORT, () =>
  console.log(`App is running on http://localhost:${PORT}`)
);
