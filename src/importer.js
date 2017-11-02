import path from 'path'
import fs from 'fs'
import { remote } from 'electron'
import toMarkdown from 'to-markdown'
import { jsdom } from 'jsdom'
const { dialog } = remote
const { Note } = inkdrop.models

export function openImportDialog () {
  return dialog.showOpenDialog({
    title: 'Open HTML file',
    properties: [
      'openFile', 'multiSelections'
    ],
    filters: [
      { name: 'HTML Files', extensions: [ 'html' ] }
    ]
  })
}

export async function importHTMLFromMultipleFiles (files, destBookId) {
  try {
    for (let i = 0; i < files.length; ++i) {
      await importHTMLFromFile(files[i], destBookId)
    }
  } catch (e) {
    inkdrop.notifications.addError('Failed to import the HTML file', { detail: e.stack, dismissable: true })
  }
}

function parseMetaTag (dom, metaName) {
  if (!dom) {
    throw new Error('Invalid DOM')
  }
  const meta = dom.querySelector(`meta[name=${metaName}]`)
  if (meta) {
    const content = meta.attributes['content']
    if (content) {
      return content.value
    }
  }
  return false
}

function getMetaFromHTML (html) {
  const dom = jsdom(html)
  const meta = {
    tags: [],
    createdAt: +new Date(),
    updatedAt: +new Date()
  }
  const keywords = parseMetaTag(dom, 'keywords')
  if (keywords) {
    meta.tags = keywords.split(',').map((tag) => tag.trim())
  }
  const created = parseMetaTag(dom, 'created')
  if (created) {
    meta.createdAt = +new Date(created)
  }
  const updated = parseMetaTag(dom, 'updated')
  if (updated) {
    meta.updatedAt = +new Date(updated)
  }
  const titleTag = dom.querySelector('title')
  if (titleTag) {
    meta.title = titleTag.text
  }
  return meta
}

export async function importHTMLFromFile (fn, destBookId) {
  if (!destBookId) {
    throw new Error('Destination notebook ID is not specified.')
  }
  const html = fs.readFileSync(fn, 'utf-8')
  const titleFromFileName = path.basename(fn, path.extname(fn))
  const body = convertToMarkdown(html)
  const { tags, createdAt, updatedAt, title } = getMetaFromHTML(html)

  const note = new Note({ title: title || titleFromFileName, body, tags, createdAt, updatedAt })
  note.bookId = destBookId
  await note.save()
}

export function convertToMarkdown (html) {
  const md = toMarkdown(html, {
    gfm: true,
    converters: [
      {
        filter: ['div', 'p', 'dt', 'dd', 'summary'],
        replacement (innerHTML) {
          return '\n' + innerHTML + '\n'
        }
      },
      {
        filter: ['font', 'span', 'pre', 'article', 'section', 'nav', 'button', 'main', 'footer', 'header', 'aside', 'details', 'u', 'samp', 'var', 'kbd', 'legend', 'mark', 'output', 'small', 'sub', 'sup'],
        replacement (innerHTML) {
          return innerHTML
        }
      },
      {
        filter: ['input', 'form', 'iframe', 'canvas', 'embed', 'select', 'rt', 'wbr'],
        replacement (innerHTML) {
          return ''
        }
      },
      {
        filter: ['img'],
        replacement (innerHTML, node) {
          return '' // not supported, yet
        }
      }
    ]
  })
  return md
}
