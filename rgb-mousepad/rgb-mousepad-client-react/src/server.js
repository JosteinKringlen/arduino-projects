const express = require('express');
// const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const SerialPort = require('serialport');
const inputPortMac = '/dev/cu.usbmodem1411';
const port = new SerialPort(inputPortMac, {autoOpen: true, baudRate: 9600});
const cors = require('cors');

app.use(express.static(path.join(__dirname, 'build')));
app.use(cors());

app.post('/:id', (req, res) => {
    const id = req.params.id;
    port.write(id, err => {
        if (err) {
            return console.log(err)
        }
        res.sendStatus(204);
    });
});

app.post('/startup', (req, res) => {
    port.open(err => {
        console.error(err);
        res.sendStatus(500);
    });
});

app.post('/quit', (req, res) => {
    port.write(0, err => {
        if (err) {
            return console.log(err)
        }
        res.sendStatus(204);

    });
});

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(process.env.PORT || 8080);

