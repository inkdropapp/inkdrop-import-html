import { importUtils } from 'inkdrop'

import { getEnv } from './env.js'

export function openImportDialog() {
  return getEnv().dialog.showOpenDialog({
    title: 'Open HTML file',
    properties: ['openFile', 'multiSelections'],
    filters: [{ name: 'HTML Files', extensions: ['html', 'htm'] }]
  })
}

export async function importHTMLFromMultipleFiles(files: string[], destBookId: string) {
  try {
    for (let i = 0; i < files.length; ++i) {
      await importHTMLFromFile(files[i], destBookId)
    }
  } catch (e) {
    getEnv().notifications.addError('Failed to import the HTML file', {
      detail: e instanceof Error ? e.stack : String(e),
      dismissable: true
    })
  }
}

export async function importHTMLFromFile(fn: string, destBookId: string) {
  return importUtils.importHtmlFile(fn, destBookId)
}
