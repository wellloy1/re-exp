function generateReExportCode2(exportedNames, extension) {
	let exportStatements = exportedNames.map((name) => {
		if (name === "default") {
			return `export { default } from './source';`
		} else if (name.startsWith("*:")) {
			const modulePath = name.split(": ")[1].trim()
			return `export * from '${modulePath}';`
		} else {
			return `export { ${name} } from './source';`
		}
	})

	// Join all export statements with a newline character
	return exportStatements.join("\n")
}

function generateReExportCode(filename, exportedNames, extension) {
	let exportDefaultStatement = ""
	let exported = []
	let exportString = ""

	if (exportedNames.includes("default") && exportedNames.includes(filename)) {
		return `export * as ${filename} from './${filename}'\n`
	}

	if (!exportedNames.includes("default") && !exportedNames.includes(filename) && exportedNames.length > 1) {
		return `export * as ${filename} from './${filename}'\n`
	}

	exportedNames.forEach((exportedName) => {
		if (exportedName === "default") {
			exportDefaultStatement = `export { default as ${filename} } from './${filename}'`
		} else {
			exported.push(exportedName)
		}
	})

	exportString = exportDefaultStatement
	if (exportString !== "" && exported.length > 0) exportString += "\n"
	if (exported.length > 0) exportString += `export { ${exported.join(", ")} } from './${filename}'`
	if (exportString !== "") exportString += "\n"

	return exportString
}

function generateReExportCodeCJS(filename, exportedNames, extension) {
	let exportDefaultStatement = ""
	let exported = []
	let exportString = ""

	if (exportedNames.includes("default") && exportedNames.includes(filename)) {
		return `module.exports.${filename} = require('./${filename}')\n`
	}

	if (!exportedNames.includes("default") && !exportedNames.includes(filename) && exportedNames.length > 1) {
		return `module.exports.${filename} = require('./${filename}')\n`
	}

	exportedNames.forEach((exportedName) => {
		if (exportedName === "default") {
			exportDefaultStatement = `module.exports.${filename} = require('./${filename}').default`
		} else {
			exported.push(exportedName)
		}
	})

	exportString = exportDefaultStatement
	if (exportString !== "" && exported.length > 0) exportString += ";\n"
	if (exported.length > 0) {
		exportString += `const { ${exported.join(", ")} } = require('./${filename}');\n`
		exportString += `module.exports = { `
		if (exportDefaultStatement) {
			exportString += `...module.exports, `
		}
		exportString += `${exported.join(", ")} }`
	}
	if (exportString !== "") exportString += ";\n"

	return exportString
}
module.exports = { generateReExportCode, generateReExportCodeCJS }
