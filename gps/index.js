const SerialPort = require('serialport')
const Readline = require('@serialport/parser-readline')
const nmea = require('@drivetech/node-nmea')
const fs = require('fs')

const port = '/dev/ttyAMA0'
const baudRate = 9600

const date = new Date().toLocaleString('fr-FR', {day: '2-digit', month: '2-digit', year: 'numeric'}).replace(/\//gi, '-')
const filename = `/data/GPS-${date}.txt`
const filestream = fs.createWriteStream(filename, {flags:'a'})
filestream.write(`---\n${new Date().toLocaleString('fr-FR', {minute: '2-digit', hour: '2-digit', hour12: false})}\n`)

console.log(`opening serial on ${port} at rate ${baudRate}`)

const serial = new SerialPort(port, { baudRate })

const parser = serial.pipe(new Readline({ delimiter: '\r\n', encoding: 'utf8' }))

parser.on('data', (raw) => {
	const data = nmea.parse(raw)
	console.log(data)
	if (data.valid) {
		filestream(JSON.stringify(data) + '\n')
	}
})


serial.on('open', (data) => { console.log(`${port} open`) })
serial.on('error', console.error)
