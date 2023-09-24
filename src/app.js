let express = require('express');
let path= require('path');
let app = express();

console.log(__dirname)

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.render('index');
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});