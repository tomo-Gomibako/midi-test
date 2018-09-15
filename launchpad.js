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
			[7, 23, 39, 55, 71, 87, 103, 119]]
		this.open()
	}
	put(x, y, r = 0, g = 0) {
		if(x === undefined) throw new Error(`Launchpad: argument "x" is required`)
		if(y === undefined) throw new Error(`Launchpad: argument "y" is required`)
		x = this._clamp(x, 0, this.keys.length - 1)
		y = this._clamp(y, 0, this.keys[x].length - 1)
		r = this._clamp(r, 0, 3)
		g = this._clamp(g, 0, 3)
		const rbin = ("0" + r.toString(2)).slice(-2)
		const gbin = ("0" + g.toString(2)).slice(-2)
		const clear = "0"
		const copy = "0"
		const velocity = "0" + gbin + clear + copy + rbin
		this.output.sendMessage([144, this.keys[y][x], parseInt(velocity, 2)])
	}
	on(cb) {
		this.input.on("message", cb)
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
}

module.exports = Launchpad
