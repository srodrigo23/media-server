let express = require('express');
let path = require('path');
let fs = require('fs');
let app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.render('index');
});

const uploadMiddleware = require('./middlewares/upload');

app.post('/upload', uploadMiddleware, (req, res)=>{
  const files = req.files;
  // Process and store the files as required
  // For example, save the files to a specific directory using fs module
  files.forEach((file) => {
    const filePath = `uploads/${file.filename}`;
    fs.rename(file.path, filePath, (err) => {
      if (err) {
        // Handle error appropriately and send an error response
        return res.status(500).json({ error: 'Failed to store the file' });
      }
    });
    res.render('index', { fileName:file.path });
    // next()
  });
  // res.render('index', { fileName:file.path });
  // res.redirect('/');
  // next();
  // Send an appropriate response to the client
  // res.status(200).json({ message: 'File upload successful' });
  
})

app.get('/music',(req, res) =>{
  res.render('music');
});

app.get('/images',(req, res) =>{
  res.render('images');
});

app.get('/video',(req, res) =>{
  res.render('video');
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});