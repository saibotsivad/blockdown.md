import { readFile, writeFile } from 'node:fs/promises'

import {remark} from 'remark'
import remarkToc from 'remark-toc'
import { toHast } from 'mdast-util-to-hast'
import { toHtml } from 'hast-util-to-html'
import { fromMarkdown } from 'mdast-util-from-markdown'
import { gfm } from 'micromark-extension-gfm'
import { gfmFromMarkdown } from 'mdast-util-gfm'
import {rehype} from 'rehype'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'

const START_DELIMITER = '<!--START_CONTENT-->'
const END_DELIMITER = '<!--END_CONTENT-->'

const HTML = await readFile('./public/index.html', 'utf8')
const MARKDOWN = String(await remark()
	.use(remarkToc, { maxDepth: 2, tight: true })
	.process(await readFile('./src/index.md', 'utf8')))

const lines = HTML.split('\n')
const startIndex = lines.findIndex(line => line === START_DELIMITER)
const endIndex = lines.findIndex(line => line === END_DELIMITER)
const contentStart = lines.slice(0, startIndex).join('\n')
const contentEnd = lines.slice(endIndex + 1, lines.length).join('\n')

const mdastTree = await fromMarkdown(MARKDOWN, {
	extensions: [
		gfm(),
	],
	mdastExtensions: [
		gfmFromMarkdown(),
	],
})
const hastTree = toHast(mdastTree, { allowDangerousHtml: true })
const renderedMarkdown = toHtml(hastTree, { allowDangerousHtml: true })
const withHeaderLinks = String(await rehype()
	.data('settings', { fragment: true })
	.use(rehypeSlug)
	.use(rehypeAutolinkHeadings)
	.process(renderedMarkdown))


await writeFile(
	'./public/index.html',
	[
		contentStart,
		START_DELIMITER,
		withHeaderLinks,
		END_DELIMITER,
		contentEnd,
	].join('\n'),
	'utf8',
)
