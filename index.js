const Launchpad = require("./launchpad.js")
const Lifegame = require("./lifegame.js")

const launchpad = new Launchpad()
const lifegame = new Lifegame(8, 8)

function syncLaunchpad(pad, field) {
	// pad.clear()
	for(let y in field) {
		for(let x in field[y]) {
			pad.putkey(x, y, 0, 0)
			if(field[y][x]) pad.putkey(x, y, 0, 3)
		}
	}
}

console.log(launchpad.outputDevice)
launchpad.clear()
launchpad.putbutton("1", 1, 0)
launchpad.putbutton("7", 1, 3)
launchpad.putbutton("8", 3, 2)
// lifegame.setRandom()
// lifegame.field[5][5].alive = true
// lifegame.field[6][5].alive = true
// lifegame.field[7][5].alive = true
// lifegame.field[5][6].alive = true
// lifegame.field[6][7].alive = true



let intervalId = null
launchpad.on((kb) => {
	console.log(kb)
	if(kb === "1") {
		lifegame.init(8, 8)
		syncLaunchpad(launchpad, lifegame.states)
	}
	if(kb === "7") {
		lifegame.setRandom()
		syncLaunchpad(launchpad, lifegame.states)
	}
	if(kb === "8") {
		if(intervalId === null) {
			syncLaunchpad(launchpad, lifegame.states)
			intervalId = setInterval(() => {
				lifegame.update()
				syncLaunchpad(launchpad, lifegame.states)
			}, 500)
			launchpad.putbutton("8", 0, 3)
		} else {
			clearInterval(intervalId)
			intervalId = null
			launchpad.putbutton("8", 3, 2)
		}
	}
	if(kb instanceof Array) {
		clearInterval(intervalId)
		intervalId = null
		launchpad.putbutton("8", 3, 2)

		lifegame.setStatus(kb[0], kb[1], !lifegame.getStatus(kb[0], kb[1]))
		syncLaunchpad(launchpad, lifegame.states)
	}
})

// launchpad.putbutton("3", 3, 3)

// console.log(lifegame.field.map(v => v.map(w => w.around.reduce((p, c) => (c ? 1 : 0) + p, 0)).join(", ")).join("\n"))
process.on("SIGINT", () => {
	launchpad.close()
	process.exit(0)
	// setTimeout(() => {
	// 	console.log("exit")
	// }, 1000)
})
