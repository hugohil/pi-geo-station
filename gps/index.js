const nmea = require('@drivetech/node-nmea')
const fs = require('fs')
const { spawn } = require('child_process')

const today = new Date()
const day = (today.getDate() < 10) ? '0' + today.getDate() : today.getDate()
const month = ((today.getMonth() + 1) < 10) ? '0' + (today.getMonth() + 1) : (today.getMonth() + 1)
const year = today.getFullYear()
const date = `${day}-${month}-${year}`

const filename = `/data/GPS-${date}.txt`
const filestream = fs.createWriteStream(filename, {flags:'a'})
filestream.write(`---\n${new Date().toLocaleString('fr-FR', {minute: '2-digit', hour: '2-digit', hour12: false})}\n`)

let gpspipe = spawn('gpspipe', ['-r', '-n 16']) 

gpspipe.stdout.on('data', (raw) => {
	raw = raw.toString('utf8').replace('\r\n', '')
	console.log(raw)
	const data = nmea.parse(raw)
	console.log(data)
	if (data.valid) {
		try {
			filestream.write(JSON.stringify(data) + '\n')
		} catch (e) {
			console.error(e)
		}
	}
})

gpspipe.stderr.on('data', (data) => {
	console.error(`stderr: ${data}`)
})

gpspipe.on('close', (code) => {
	console.log('gpspipe closed')
})
