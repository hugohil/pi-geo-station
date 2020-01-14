const SerialPort = require('serialport')
const Readline = require('@serialport/parser-readline')
const nmea = require('@drivetech/node-nmea')

const port = '/dev/ttyAMA0'
const baudRate = 9600

console.log(`opening serial on ${port} at rate ${baudRate}`)

const serial = new SerialPort(port, { baudRate })


const parser = serial.pipe(new Readline({ delimiter: '\r\n', encoding: 'utf8' }))

parser.on('data', (raw) => {
	const data = nmea.parse(raw)
	if (data.valid) {
		console.log(data)
	}
})


serial.on('open', (data) => { console.log(`${port} open`) })
serial.on('error', console.error)
