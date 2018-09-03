const SerialPort = require('serialport');
const Readline = SerialPort.parsers.Readline;
const inputPortMac = '/dev/cu.usbmodem1411';
const port = new SerialPort(inputPortMac, {autoOpen: false, baudRate: 9600});

const callToArduino = id => {
	port.write(id, err => {
		if (err) console.error(err);
	})
};

const connectToPort = () => {
	// console.log(SerialPort.list().then(res => res.json()).then(res => console.log(res)));
	// portExists("usbmodem1411").then(res => console.log(res?"exists":"doesnt exist"));
	/*port.open(err => {
		if (err) {
			console.log(err)
			return Promise.reject(new Error('morra di'));
		}
	});*/
};

const portExists = portName => {
	SerialPort.list()
		.then(ports => console.log(ports))
};

module.exports = { callToArduino, connectToPort };
