class Lifegame {
	constructor(width, height) {
		this.Cell = class {
			constructor(x, y) {
				if(x === undefined) throw new Error(`Cell: argument "x" is required`)
				if(y === undefined) throw new Error(`Cell: argument "y" is required`)
				this.coordinate = [null, null]
				this.x = x
				this.y = y
				this.status = false
				this.nextStatus = false
				this.around = [null, null, null, null, null, null, null, null]
			}
			setAround(upper = null, upperright = null, right = null, lowerright = null, lower = null, lowerleft = null, left = null, upperleft = null) {
				this.around[0] = upper
				this.around[1] = upperright
				this.around[2] = right
				this.around[3] = lowerright
				this.around[4] = lower
				this.around[5] = lowerleft
				this.around[6] = left
				this.around[7] = upperleft
			}
			setNext() {
				let livesaround = 0
				for(let i in this.around) {
					if(!this.around[i]) continue
					if(this.around[i].alive) livesaround++
				}
				this.nextStatus = this.status
				if(this.status && (livesaround <= 1 || livesaround >= 4)) this.nextStatus = false
				if(!this.status && livesaround === 3) this.nextStatus = true
			}
			update() {
				this.status = this.nextStatus
			}
			set x(val) {
				this.coordinate[0] = val
			}
			get x() {
				return this.coordinate[0]
			}
			set y(val) {
				this.coordinate[1] = val
			}
			get y() {
				return this.coordinate[1]
			}
			set alive(val) {
				if(typeof val !== "boolean") throw new Error(`Cell.alive: alive must be boolean`)
				this.status = val
			}
			get alive() {
				return this.status
			}
		}
		this.width = width
		this.height = height
		this.field = null

		this.init(this.width, this.height)
	}
	init(width, height) {
		if(width === undefined) throw new Error(`Lifegame.init(): argument "width" is required`)
		if(height === undefined) throw new Error(`Lifegame.init(): argument "height" is required`)
		this.field = new Array(width).fill(null)
		for(let x in this.field) {
			this.field[x] = new Array(height).fill(null)
			for(let y in this.field[x]) {
				this.field[x][y] = new this.Cell(x, y)
			}
		}
		for(let x in this.field) {
			x = +x
			for(let y in this.field[x]) {
				y = +y
				const upper = this.field[x][y - 1]
				const upperright = this.field[x + 1] ? this.field[x + 1][y - 1] : undefined
				const right = this.field[x + 1] ? this.field[x + 1][y] : undefined
				const lowerright = this.field[x + 1] ? this.field[x + 1][y + 1] : undefined
				const lower = this.field[x][y + 1]
				const lowerleft = this.field[x - 1] ? this.field[x - 1][y + 1] : undefined
				const left = this.field[x - 1] ? this.field[x - 1][y] : undefined
				const upperleft = this.field[x - 1] ? this.field[x - 1][y - 1] : undefined
				this.field[x][y].setAround(
					upper,
					upperright,
					right,
					lowerright,
					lower,
					lowerleft,
					left,
					upperleft)
			}
		}
	}
	update() {
		for(let x in this.field) {
			for(let y in this.field[x]) {
				this.field[x][y].setNext()
			}
		}
		for(let x in this.field) {
			for(let y in this.field[x]) {
				this.field[x][y].update()
			}
		}
	}
	setStatus(x, y, status) {
		if(x === undefined) throw new Error(`Lifegame.setStatus(): argument "x" is required`)
		if(y === undefined) throw new Error(`Lifegame.setStatus(): argument "y" is required`)
		this.field[x][y].alive = status
		return true
	}
	setRandom() {
		for(let x in this.field) {
			for(let y in this.field[x]) {
				this.setStatus(x, y, Boolean((Math.random() * 2) | 0))
			}
		}
	}
	get states() {
		if(!this.field) throw new Error(`Lifegame.states: field is not set`)
		return this._transpose(this.field).map(v => v.map(w => Number(w.alive)).join(", ")).join("\n")
		// return this.field.map(v => v.map(w => Number(w.alive)).join(", ")).join("\n")
	}
	_transpose(arr) {
		return arr[0].map((_, c) => arr.map(r => r[c]))
	}
}

module.exports = Lifegame
