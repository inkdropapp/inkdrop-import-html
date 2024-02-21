'use babel'

import React, { useEffect, useCallback } from 'react'
import { useModal } from 'inkdrop'

const ImportHTMLSelectNotebookDialog = _props => {
  const { NotebookListBar } = inkdrop.components.classes
  const modal = useModal()
  const { Dialog } = inkdrop.components.classes

  const showDialog = useCallback(() => {
    modal.show()
  }, [])

  const importHTMLFile = useCallback(async destBookId => {
    const {
      openImportDialog,
      importHTMLFromMultipleFiles
    } = require('./importer')
    const { filePaths } = await openImportDialog()
    if (filePaths) {
      modal.close()
      await importHTMLFromMultipleFiles(filePaths, destBookId)
    } else {
      return false
    }
  }, [])

  const handleNotebookSelect = useCallback(
    bookId => {
      importHTMLFile(bookId)
    },
    [importHTMLFile]
  )

  useEffect(() => {
    const sub = inkdrop.commands.add(document.body, {
      'import-html:import-from-file': showDialog
    })
    return () => sub.dispose()
  }, [showDialog])

  return (
    <Dialog
      {...modal.state}
      large
      onBackdropClick={modal.close}
      onEscKeyDown={modal.close}
      className="import-html-select-notebook-dialog"
    >
      <Dialog.Title>Import Notes from HTML</Dialog.Title>
      <Dialog.Content>
        <div className="ui message">Please select a notebook</div>
        <div className="ui form">
          <div className="field">
            <NotebookListBar onItemSelect={handleNotebookSelect} />
          </div>
        </div>
      </Dialog.Content>
      <Dialog.Actions className="right aligned">
        <button className="ui button" onClick={modal.close}>
          Cancel
        </button>
      </Dialog.Actions>
    </Dialog>
  )
}

export default ImportHTMLSelectNotebookDialog
