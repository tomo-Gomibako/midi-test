const midi = require("midi")

class Launchpad {
	constructor() {
		this.input = new midi.input()
		this.output = new midi.output()
		this.inputDevice = null
		this.outputDevice = null
		this.keys = [
			[0, 16, 32, 48, 64, 80, 96, 112],
			[1, 17, 33, 49, 65, 81, 97, 113],
			[2, 18, 34, 50, 66, 82, 98, 114],
			[3, 19, 35, 51, 67, 83, 99, 115],
			[4, 20, 36, 52, 68, 84, 100, 116],
			[5, 21, 37, 53, 69, 85, 101, 117],
			[6, 22, 38, 54, 70, 86, 102, 118],
			[7, 23, 39, 55, 71, 87, 103, 119],
			[8, 24, 40, 56, 72, 88, 104, 120]]
		this.buttons = {
			"1": [176, 104],
			"2": [176, 105],
			"3": [176, 106],
			"4": [176, 107],
			"5": [176, 108],
			"6": [176, 109],
			"7": [176, 110],
			"8": [176, 111],
			"A": [144, 8],
			"B": [144, 24],
			"C": [144, 40],
			"D": [144, 56],
			"E": [144, 72],
			"F": [144, 88],
			"G": [144, 104],
			"H": [144, 120]
		}
		this.open()
	}
	putkey(x, y, r = 0, g = 0) {
		if(x === undefined) throw new Error(`Launchpad.putkey: argument "x" is required`)
		if(y === undefined) throw new Error(`Launchpad.putkey: argument "y" is required`)
		x = this._clamp(x, 0, this.keys.length - 1)
		y = this._clamp(y, 0, this.keys[x].length - 1)
		r = this._clamp(r, 0, 3)
		g = this._clamp(g, 0, 3)
		const rbin = ("0" + r.toString(2)).slice(-2)
		const gbin = ("0" + g.toString(2)).slice(-2)
		const clear = "0"
		const copy = "0"
		const velocity = "0" + gbin + clear + copy + rbin
		this.output.sendMessage([144, this.keys[x][y], parseInt(velocity, 2)])
	}
	putbutton(name, r = 0, g = 0) {
		if(name === undefined) throw new Error(`Launchpad.putbutton: argument "name" is required`)
		let button = null
		if((button = this.buttons[name]) === undefined) throw new Error(`Launchpad.putbutton: ${ name } is invalid button name`)
		r = this._clamp(r, 0, 3)
		g = this._clamp(g, 0, 3)
		const rbin = ("0" + r.toString(2)).slice(-2)
		const gbin = ("0" + g.toString(2)).slice(-2)
		const clear = "0"
		const copy = "0"
		const velocity = "0" + gbin + clear + copy + rbin
		this.output.sendMessage([button[0], button[1], parseInt(velocity, 2)])
	}
	on(cb, all = false) {
		this.input.on("message", (deltaTime, message) => {
			if(!all && !message[2]) return
			const keybutton = this._find(message[0], message[1])
			cb(keybutton, deltaTime, message)
		})
	}
	clear() {
		this.output.sendMessage([176, 0, 0])
	}
	reset() {
		this.close()
		delete this.input
		delete this.output
		this.input = new midi.input()
		this.output = new midi.output()
		this.open()
	}
	open() {
		this.input.getPortCount()
		this.output.getPortCount()
		this.inputDevice = this.input.getPortName(0)
		this.outputDevice = this.output.getPortName(0)
		this.input.openPort(0)
		this.output.openPort(0)
		this.input.ignoreTypes(false, false, false)
	}
	close() {
		this.input.closePort()
		this.output.closePort()
	}
	_clamp(n, min, max) {
		if(n < min) n = min
		if(n > max) n = max
		return n
	}
	_find(status, note) {
		for(let key in this.buttons) {
			const button = this.buttons[key]
			if(note === button[1] && status === button[0]) return key
		}
		for(let x in this.keys) {
			for(let y in this.keys[x]) {
				if(note === this.keys[x][y] && status === 144) return [+x, +y]
			}
		}
	}
}

module.exports = Launchpad
