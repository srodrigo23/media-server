const express = require('express');
const path = require('path');

const session = require('express-session');
const app = express();

const fs = require('fs');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json());

// Middleware to parse URL-encoded bodies (for form submissions)
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret:'a_secret_session',
  resave:false,
  saveUninitialized:false,
  cookie:{ maxAge: 60*60*1000 } // this session expires in 1hr
}))

app.get('/', (req, res) => {
  res.redirect('/music');
});

app.get('/login', (req, res)=>{
  res.render('login', {title: 'Login'});
})

app.post('/login', (req, res)=>{
  const {username, password} = req.body
  if(username === 'admin' && password==='admin'){
    req.session.user = { username:username }
    res.redirect('/music')
  }else{
    res.render('login', {error:'Usuario Inválido'})
  }
})

app.get('/logout', (req, res)=>{
  req.session.destroy((err)=>{
    if(err){
      console.error('Error destroying session:', err)
      return res.redirect('/error')
    }
    res.clearCookie('connect.sid'); //clear the session cookie (if using connect.sid)
    res.redirect('/login')
  });
});

const isAuthenticated = (req, res, next) => {
  if(req.session.user){
    next();
  }else{
    res.redirect('/login')
  }
}

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

app.get('/music', isAuthenticated, (req, res) =>{
  res.render('music', {'label':'music'});
});

app.get('/images', isAuthenticated, (req, res) =>{
  res.render('images', {'label':'image'});
});

app.get('/video', isAuthenticated, (req, res) =>{
  res.render('video', {'label':'video'});
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
})