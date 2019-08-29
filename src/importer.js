import path from 'path'
import fs from 'fs'
import { remote } from 'electron'
import { html2markdown, extractMetaFromHtml, models } from 'inkdrop'
import { JSDOM } from 'jsdom'
const { dialog } = remote
const { Note } = models

export function openImportDialog() {
  return dialog.showOpenDialog({
    title: 'Open HTML file',
    properties: ['openFile', 'multiSelections'],
    filters: [{ name: 'HTML Files', extensions: ['html', 'htm'] }]
  })
}

export async function importHTMLFromMultipleFiles(files, destBookId) {
  try {
    for (let i = 0; i < files.length; ++i) {
      await importHTMLFromFile(files[i], destBookId)
    }
  } catch (e) {
    inkdrop.notifications.addError('Failed to import the HTML file', {
      detail: e.stack,
      dismissable: true
    })
  }
}

export async function importHTMLFromFile(fn, destBookId) {
  if (!destBookId) {
    throw new Error('Destination notebook ID is not specified.')
  }
  if (!destBookId.startsWith('book:')) {
    throw new Error('Invalid destination notebook ID specified: ' + destBookId)
  }
  const html = fs.readFileSync(fn, 'utf-8')
  const titleFromFileName = path.basename(fn, path.extname(fn))
  const body = html2markdown(html)
  const { tags, createdAt, updatedAt, title } = extractMetaFromHtml(html)

  const note = new Note({
    title: title || titleFromFileName,
    body,
    tags,
    createdAt,
    updatedAt
  })
  note.bookId = destBookId
  await note.save()
}
