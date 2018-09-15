const Launchpad = require("./launchpad.js")
const Lifegame = require("./lifegame.js")

const launchpad = new Launchpad()
const lifegame = new Lifegame(8, 8)

function syncLaunchpad(pad, field) {
	pad.clear()
	for(let x in field) {
		for(let y in field[x]) {
			if(field[x][y]) pad.put(x, y, 0, 3)
		}
	}
}

console.log(launchpad.outputDevice)
lifegame.setRandom()
// lifegame.field[5][5].alive = true
// lifegame.field[6][5].alive = true
// lifegame.field[7][5].alive = true
// lifegame.field[5][6].alive = true
// lifegame.field[6][7].alive = true

setInterval(() => {
	lifegame.update()
	syncLaunchpad(launchpad, lifegame.states)
}, 500)

// console.log(lifegame.field.map(v => v.map(w => w.around.reduce((p, c) => (c ? 1 : 0) + p, 0)).join(", ")).join("\n"))
process.on("SIGINT", () => {
	launchpad.close()
	process.exit(0)
	// setTimeout(() => {
	// 	console.log("exit")
	// }, 1000)
})
