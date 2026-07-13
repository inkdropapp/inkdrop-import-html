import { getEnv } from './env.js'
import { ImportWizardNotebookStep } from './import-wizard-notebook-step.js'
import { ImportWizardProgressStep } from './import-wizard-progress-step.js'

export type WizardStep = 'notebook' | 'progress'

type Props = {
  modal: { state: Record<string, any>; close: () => void }
  step: WizardStep
  status: string
  selectedBookId: string | null
  importingFilePath: string
  importError: Error | null
  onSelectNotebook: (bookId: string | null) => void
  onImport: () => void
}

export const ImportHTMLWizardDialog = ({
  modal,
  step,
  status,
  selectedBookId,
  importingFilePath,
  importError,
  onSelectNotebook,
  onImport
}: Props) => {
  const Dialog = getEnv().components.classes.Dialog as any

  return (
    <Dialog
      {...modal.state}
      large
      onBackdropClick={modal.close}
      onEscKeyDown={modal.close}
      className={`import-html-wizard-dialog import-html-wizard-dialog--${step}`}
    >
      <Dialog.Title>Import Notes from HTML</Dialog.Title>
      {step === 'notebook' && (
        <ImportWizardNotebookStep
          selectedBookId={selectedBookId}
          onSelectNotebook={onSelectNotebook}
          onCancel={modal.close}
          onImport={onImport}
        />
      )}
      {step === 'progress' && (
        <ImportWizardProgressStep
          status={status}
          importingFilePath={importingFilePath}
          importError={importError}
          onClose={modal.close}
        />
      )}
    </Dialog>
  )
}
