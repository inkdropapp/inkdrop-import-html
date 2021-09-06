const path = require('path')
const fs = require('fs')
const { remote, nativeImage } = require('electron')
const { html2markdown, extractMetaFromHtml, models } = require('inkdrop')
const escapeRegExp = require('lodash.escaperegexp')
const { extractImages } = require('inkdrop-import-utils')
const { dialog } = remote
const { Note, File: IDFile } = models

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

/**
 * Import images from given Markdown data with the specified base path
 *
 * @param {string} md - The Markdown content
 * @param {string} basePath - The base path to the Markdown file
 * @returns {string} The modified Markdown with attachment images
 */
async function importImages(md, basePath) {
  const images = extractImages(md)
  for (const image of images) {
    const imagePath = path.resolve(basePath, decodeURIComponent(image.url))
    if (fs.existsSync(imagePath)) {
      try {
        const imageData = nativeImage.createFromPath(imagePath)
        const fileTitle = path.basename(imagePath)
        const file = await IDFile.createFromNativeImage(imageData, fileTitle)
        const imageRegex = new RegExp(
          escapeRegExp(`![${image.alt || ''}](${image.url})`),
          'g'
        )
        md = md.replace(
          imageRegex,
          `![${image.alt || ''}](inkdrop://${file._id})`
        )
      } catch (e) {
        inkdrop.notifications.addError('Failed to import an image', {
          detail: `${imagePath}: ${e.message}`,
          dismissable: true
        })
      }
    }
  }
  return md
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
  const basePath = path.dirname(fn)
  const bodyWithImages = await importImages(body, basePath)

  const note = new Note({
    title: title || titleFromFileName,
    body: bodyWithImages,
    tags,
    createdAt,
    updatedAt
  })
  note.bookId = destBookId
  await note.save()
}
