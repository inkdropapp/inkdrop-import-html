import { useEffect, useCallback } from 'react'
import { useModal } from 'inkdrop'
import { openImportDialog, importHTMLFromMultipleFiles } from './importer'

const ImportHTMLSelectNotebookDialog = () => {
  const NotebookListBar = inkdrop.components.classes.NotebookListBar as any
  const modal = useModal()
  const Dialog = inkdrop.components.classes.Dialog as any

  const showDialog = useCallback(() => {
    modal.show()
  }, [modal])

  const importHTMLFile = useCallback(
    async (destBookId: string) => {
      const { filePaths } = await openImportDialog()
      if (filePaths) {
        modal.close()
        await importHTMLFromMultipleFiles(filePaths, destBookId)
      } else {
        return false
      }
    },
    [modal]
  )

  const handleNotebookSelect = useCallback(
    (bookId: string) => {
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
      <Dialog.Content flex>
        <div className="ui message" style={{ flex: '0 0' }}>
          Please select a notebook
        </div>
        <NotebookListBar onItemSelect={handleNotebookSelect} />
      </Dialog.Content>
      <Dialog.Actions>
        <button className="ui button" onClick={modal.close}>
          Cancel
        </button>
      </Dialog.Actions>
    </Dialog>
  )
}

export default ImportHTMLSelectNotebookDialog
