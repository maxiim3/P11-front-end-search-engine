const {readdirSync} = require("fs")
const {extname} = require("path")

const rootPath = "./public/js"
const realPath = "./public/js"
const rootFiles = readdirSync(rootPath)
const output = []
rootFiles.forEach(el => {
	const ext = extname(el)
	const pathL2 = `${rootPath}/${el}`
	const pathL2True = `${realPath}/${el}`
	if (ext === ".js") {
		output.push(pathL2True)
	} else if (ext !== ".js" && ext !== ".map" && ext !== ".ts") {
		const filesL2 = readdirSync(pathL2)

		filesL2.forEach(elL2 => {
			const ext = extname(elL2)
			const pathL3 = `${rootPath}/${el}/${elL2}`
			const pathL3True = `${realPath}/${el}/${elL2}`

			if (ext !== ".js" && ext !== ".map" && ext !== ".ts") {
				const filesL3 = readdirSync(pathL3)

				filesL3.forEach(elL3 => {
					const ext = extname(elL3)
					const pathL4 = `${rootPath}/${el}/${elL2}/${elL3}`
					const pathL4True = `${realPath}/${el}/${elL2}/${elL3}`
					if (ext === ".js") {
						output.push(pathL4True)
					}
				})
			} else if (ext === ".js") {
				output.push(pathL3True)
			}
		})
	}
})

module.exports.output = output
