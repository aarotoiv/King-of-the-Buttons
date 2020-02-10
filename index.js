const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const gameSocket = require('./sockets/GameSockets');
let MemoryStore = require('memorystore')(session);

const app = express();

let sessionConf = session({
    cookie: { maxAge: 86400000 },
    store: new MemoryStore({
      checkPeriod: 86400000
    }),
    secret: 'asdfasdfasdfsiafspfkpsokfposdkfs',
    name: 'kysta',
    resave: true,
    saveUninitialized: true
});

const corsOptions = {
    origin: 'http://localhost:8080',
    credentials: true
}
app.use(sessionConf);
app.use(cors(corsOptions));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function(req, res) {
    res.send({success: true});
});
app.get('/existing_user', function(req, res) {
    res.send({userName: req.session.userName});
});

const port = process.env.PORT || 5000;

const server = app.listen(port, () => console.log("RUNNING IN PORT", port));

gameSocket.initSocket(server, sessionConf);