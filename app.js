const express = require('express');
const mustacheExpress = require('mustache-express');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3000;
const cookieParser = require('cookie-parser');

app.engine('html', mustacheExpress());
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

app.use(cookieParser());

// body-parser setup
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(bodyParser.json());

// connect router
app.use(require('./router'));

// listen
app.listen(PORT, () => console.log('Server is listening on port', PORT));