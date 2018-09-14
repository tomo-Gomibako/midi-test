class Lifegame {
	constructor(width, height) {
		this.Cell = class {
			constructor(x, y) {
				if(x === undefined) throw new Error(`Cell: argument "x" is required`)
				if(y === undefined) throw new Error(`Cell: argument "y" is required`)
				this.alive = false
				this.nextAlive = false
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
				if(this.alive && (livesaround <= 1 || livesaround >= 4)) this.nextAlive = false
				if(!this.alive && livesaround === 3) this.nextAlive = true
			}
			update() {
				this.alive = this.nextAlive
				this.nextAlive = false
			}
		}
		this.width = width
		this.height = height
		this.field = null
	}
	init(width, height) {
		if(width === undefined) throw new Error(`Lifegame: argument "width" is required`)
		if(height === undefined) throw new Error(`Lifegame: argument "height" is required`)
		this.field = Array(width).fill(Array(height).fill(null))
		for(let x in this.field) {
			for(let y in this.field[x]) {
				this.field[x][y] = new this.Cell(x, y)
			}
		}
		for(let x in this.field) {
			for(let y in this.field[x]) {
				this.field[x][y].setAround(
					this.field[x][y - 1],
					this.field[x + 1][y - 1],
					this.field[x + 1][y],
					this.field[x + 1][y + 1],
					this.field[x][y + 1],
					this.field[x - 1][y + 1],
					this.field[x - 1][y],
					this.field[x - 1][y - 1])
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
	get states() {
		if(!this.field) throw new Error(`Lifegame: field is not set`)
		return this.field.map(v => Number(v.alive))
	}
}

module.exports = Lifegame
