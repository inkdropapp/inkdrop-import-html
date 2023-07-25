const remote = require('@electron/remote')
const { importUtils } = require('inkdrop')
const { dialog } = remote

module.exports = {
  openImportDialog,
  importHTMLFromMultipleFiles,
  importHTMLFromFile
}

function openImportDialog() {
  return dialog.showOpenDialog({
    title: 'Open HTML file',
    properties: ['openFile', 'multiSelections'],
    filters: [{ name: 'HTML Files', extensions: ['html', 'htm'] }]
  })
}

async function importHTMLFromMultipleFiles(files, destBookId) {
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

async function importHTMLFromFile(fn, destBookId) {
  return importUtils.importHtmlFile(fn, destBookId)
}
