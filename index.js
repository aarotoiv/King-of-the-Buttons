const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const gameSocket = require('./sockets/GameSockets');


const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


const port = process.env.PORT || 5000;

const server = app.listen(port, () => console.log("RUNNING IN PORT", port));

gameSocket.initSocket(server);