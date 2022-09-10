import { readFile, writeFile } from 'node:fs/promises'

const START_DELIMITER = '<!--START_CONTENT-->'
const END_DELIMITER = '<!--END_CONTENT-->'

const HTML = await readFile('./public/index.html', 'utf8')
const MARKDOWN = await readFile('./index.md', 'utf8')

const lines = HTML.split('\n')
const startIndex = lines.findIndex(line => line === START_DELIMITER)
const endIndex = lines.findIndex(line => line === END_DELIMITER)
const contentStart = lines.slice(0, startIndex).join('\n')
const contentEnd = lines.slice(endIndex + 1, lines.length).join('\n')

const renderedMarkdown = 'TODO2'

await writeFile(
	'./public/index.html',
	[
		contentStart,
		START_DELIMITER,
		renderedMarkdown,
		END_DELIMITER,
		contentEnd,
	].join('\n'),
	'utf8',
)
