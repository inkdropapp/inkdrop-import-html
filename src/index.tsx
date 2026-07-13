import path from 'path'

import type { Environment, IInkdropPlugin } from '@inkdropapp/types'
import { useModal, logger } from 'inkdrop'
import { useEffect, useCallback, useState } from 'react'

import { getEnv, setEnv } from './env.js'
import { ImportHTMLWizardDialog } from './import-wizard-dialog.js'
import type { WizardStep } from './import-wizard-dialog.js'
import { openImportDialog, importHTMLFromMultipleFiles } from './importer.js'

const ImportHTMLPlugin = () => {
  const [step, setStep] = useState<WizardStep>('notebook')
  const [filePaths, setFilePaths] = useState<string[]>([])
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null)
  const [status, setStatus] = useState('')
  const [processingFilePath, setProcessingFilePath] = useState('')
  const [importError, setImportError] = useState<Error | null>(null)
  const wizardDialog = useModal()

  const showDialog = useCallback(async () => {
    const { filePaths: pickedPaths } = await openImportDialog()
    if (!(pickedPaths instanceof Array) || pickedPaths.length === 0) return
    logger.debug('[import-html] Picked files:', pickedPaths)

    setFilePaths(pickedPaths)
    setSelectedBookId(null)
    setImportError(null)
    setStep('notebook')
    wizardDialog.show()
  }, [wizardDialog])

  const handleImport = useCallback(async () => {
    if (!selectedBookId) return
    setStep('progress')
    setStatus('Importing files..')
    try {
      await importHTMLFromMultipleFiles(filePaths, selectedBookId, filePath => {
        setProcessingFilePath(filePath)
        setStatus(`Importing file.. ${path.basename(filePath)}`)
      })
      getEnv().notifications.addSuccess('Import HTML files', {
        detail: `Successfully imported ${filePaths.length} HTML files!`,
        dismissable: true
      })
      wizardDialog.close()
    } catch (e) {
      setImportError(e instanceof Error ? e : new Error(String(e)))
    }
  }, [filePaths, selectedBookId, wizardDialog])

  useEffect(() => {
    const sub = getEnv().commands.add(document.body, {
      'import-html:import-from-file': showDialog
    })
    return () => sub.dispose()
  }, [showDialog])

  return (
    <ImportHTMLWizardDialog
      modal={wizardDialog}
      step={step}
      status={status}
      selectedBookId={selectedBookId}
      importingFilePath={processingFilePath}
      importError={importError}
      onSelectNotebook={setSelectedBookId}
      onImport={handleImport}
    />
  )
}

class InkdropPlugin implements IInkdropPlugin {
  activate(env: Environment) {
    setEnv(env)
    env.components.registerClass(ImportHTMLPlugin)
    env.layouts.addComponentToLayout('modal', 'ImportHTMLPlugin')
  }

  deactivate(env: Environment) {
    env.layouts.removeComponentFromLayout('modal', 'ImportHTMLPlugin')
    env.components.deleteClass(ImportHTMLPlugin)
    setEnv(undefined)
  }
}

const plugin = new InkdropPlugin()
export default plugin
