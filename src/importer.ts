import { importUtils } from 'inkdrop'

import { getEnv } from './env.js'

export function openImportDialog() {
  return getEnv().dialog.showOpenDialog({
    title: 'Open HTML file',
    properties: ['openFile', 'multiSelections'],
    filters: [{ name: 'HTML Files', extensions: ['html', 'htm'] }]
  })
}

type ProgressCallback = (filePath: string) => void

export async function importHTMLFromMultipleFiles(
  files: string[],
  destBookId: string,
  progressCallback?: ProgressCallback
) {
  for (const fp of files) {
    progressCallback?.(fp)
    await importHTMLFromFile(fp, destBookId)
  }
}

export async function importHTMLFromFile(fn: string, destBookId: string) {
  return importUtils.importHtmlFile(fn, destBookId)
}
