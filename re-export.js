const fs = require("fs")
const path = require("path")
const { getExportedNames } = require("./getExported")
const { generateReExportCode, generateReExportCodeCJS } = require("./generateReExportCode")

async function reExport({ dir, ext = "js", cjs = false, quiet = false }) {
	const dirPath = path.join(process.cwd(), dir)
	const files = await fs.promises.readdir(dirPath)

	const { count, exportStr } = await exportFunction({ dirPath, files, ext, cjs })

	if (count === 0) {
		console.log(`\nNothing found as exports in dir "${dir}" for .${ext} extension`)
		return
	}

	const indexPath = path.join(dirPath, `index.${ext}`)
	await fs.promises.writeFile(indexPath, exportStr)

	const noun = count === 1 ? "file" : "files"
	console.log(`\nCreated "${dir}/index.${ext}" file with exports from ${count} ${noun} in "${dir}" dir`)

	if (!quiet) console.log(`\nRe-exported:\n`)
	if (!quiet) console.log(exportStr)
}

async function exportFunction({ dirPath, files, ext, cjs }) {
	const exports = {}
	for (const file of files) {
		const filePath = path.join(dirPath, file)
		if (filePath === path.join(dirPath, `index.${ext}`)) continue
		const stats = await fs.promises.stat(filePath)
		if (stats.isFile() && path.extname(file) === `.${ext}`) {
			const moduleExports = getExportedNames(filePath)
			exports[path.parse(file).name] = moduleExports
		}
	}

	let count = 0

	let exportStr = ""

	const generateCodeFunction = cjs ? generateReExportCodeCJS : generateReExportCode
	Object.entries(exports).forEach(([key, arr]) => {
		count++
		exportStr += generateCodeFunction(key, arr, ext, cjs)
	})
	return { count, exportStr }
}

module.exports = { reExport }
