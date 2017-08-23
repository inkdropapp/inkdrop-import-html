'use babel'
import path from 'path'
import fs from 'fs'
import { remote } from 'electron'
import toMarkdown from 'to-markdown'
const { dialog } = remote
const { Note } = inkdrop.models

export function openImportDialog () {
  return dialog.showOpenDialog({
    title: 'Open HTML file',
    multiSelections: true,
    filters: [
      { name: 'HTML Files', extensions: [ 'html' ] }
    ]
  })
}

export function importHTMLFromMultipleFiles (files, destBookId) {
  try {
    for (let i = 0; i < files.length; ++i) {
      importHTMLFromFile(files[i], destBookId)
    }
  } catch (e) {
    inkdrop.notifications.addError('Failed to import the HTML file', { detail: e.stack, dismissable: true })
  }
}

export async function importHTMLFromFile (fn, destBookId) {
  if (!destBookId) {
    throw new Error('Destination notebook ID is not specified.')
  }
  const html = fs.readFileSync(fn, 'utf-8')
  const title = path.basename(fn, path.extname(fn))
  const body = convertToMarkdown(html)
  const note = new Note({ title, body })
  note.bookId = destBookId
  await note.save()
}

export function convertToMarkdown (html) {
  const md = toMarkdown(html, { converters: [
    {
      filter: ['div', 'p'],
      replacement (innerHTML) {
        return '\n' + innerHTML + '\n'
      }
    },
    {
      filter: ['span'],
      replacement (innerHTML) {
        return innerHTML
      }
    },
    {
      filter: ['img'],
      replacement (innerHTML, node) {
        return '' // not supported, yet
      }
    }
  ]})
  return md
}
