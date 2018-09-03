const {callToArduino} = require('./lightsLogic');

const subMenu = {
	label: 'Brightness', submenu: [
		{
			label: '10 %',
			type: 'radio',
			click: () => callToArduino(1)
		},
		{
			label: '20 %',
			type: 'radio',
			click: () => callToArduino(2)
		},
		{
			label: '30 %',
			type: 'radio',
			click: () => callToArduino(3)
		},
		{
			label: '40 %',
			type: 'radio',
			click: () => callToArduino(4)
		},
		{
			label: '50 %',
			type: 'radio',
			click: () => callToArduino(5)
		},
		{
			label: '60 %',
			type: 'radio',
			click: () => callToArduino(6)
		},
		{
			label: '70 %',
			type: 'radio',
			click: () => callToArduino(7)
		},
		{
			label: '80 %',
			type: 'radio',
			click: () => callToArduino(8)
		},
		{
			label: '90 %',
			type: 'radio',
			click: () => callToArduino(9)
		},
		{
			label: '100 %',
			type: 'radio',
			click: () => callToArduino('f'),
			checked: true
		}
	]
};

module.exports = subMenu;
