const fs = require("fs")
const recast = require("recast")
const babelParser = require("@babel/parser")

function removeDecorators(source) {
	return source.replace(/@/g, "//")
}

function getExportedNames(filepath) {
	const fileContent = fs.readFileSync(filepath, "utf-8")

	const sanitizedContent = removeDecorators(fileContent)

	const ast = recast.parse(sanitizedContent, {
		parser: {
			parse(source) {
				return babelParser.parse(source, {
					sourceType: "module",
					plugins: ["jsx", "typescript", "classProperties", "decorators-legacy"],
				})
			},
		},
	})

	const exportedNames = new Set()

	recast.visit(ast, {
		// CommonJS: module.exports = ...
		visitAssignmentExpression(path) {
			const { left, right } = path.node
			if (left.type === "MemberExpression" && left.object.name === "module" && left.property.name === "exports") {
				if (right.type === "Identifier" || right.type === "FunctionExpression" || right.type === "ClassExpression") {
					exportedNames.add("default")
				} else if (right.type === "ObjectExpression") {
					right.properties.forEach((prop) => {
						if (prop.key && prop.key.name) {
							exportedNames.add(prop.key.name)
						}
					})
				}
			}
			this.traverse(path)
		},
		// CommonJS: module.exports.Name = ...
		visitExpressionStatement(path) {
			const expr = path.node.expression
			if (
				expr.type === "AssignmentExpression" &&
				expr.left.type === "MemberExpression" &&
				expr.left.object.type === "MemberExpression" &&
				expr.left.object.object.name === "module" &&
				expr.left.object.property.name === "exports"
			) {
				exportedNames.add(expr.left.property.name)
			}
			this.traverse(path)
		},
		// ESM: ExportNamedDeclaration
		visitExportNamedDeclaration(path) {
			const declaration = path.node.declaration
			if (declaration) {
				if (declaration.declarations) {
					declaration.declarations.forEach((decl) => {
						if (decl.id && decl.id.name) {
							exportedNames.add(decl.id.name)
						}
					})
				} else if (declaration.id && declaration.id.name) {
					exportedNames.add(declaration.id.name)
				}
			}

			if (path.node.specifiers) {
				path.node.specifiers.forEach((specifier) => {
					exportedNames.add(specifier.exported.name)
				})
			}

			this.traverse(path)
		},
		// ESM: ExportDefaultDeclaration
		visitExportDefaultDeclaration(path) {
			exportedNames.add("default")
			this.traverse(path)
		},
		// ESM: ExportAllDeclaration
		visitExportAllDeclaration(path) {
			exportedNames.add("*: " + path.node.source.value)
			this.traverse(path)
		},
	})

	return Array.from(exportedNames)
}

module.exports = { getExportedNames }
