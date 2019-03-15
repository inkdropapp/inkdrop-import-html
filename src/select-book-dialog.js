import * as React from 'react'

export default class ImportHTMLSelectNotebookDialog extends React.Component {
  componentDidMount() {
    // Register command that toggles this view
    this.subscription = inkdrop.commands.add(document.body, {
      'import-html:import-from-file': this.handleImportHTMLFileCommand
    })
  }

  componentWillUnmount() {
    this.subscription.dispose()
  }

  render() {
    const { MessageDialog, NotebooklistBar } = inkdrop.components.classes
    const buttons = [
      {
        label: 'Cancel',
        cancel: true
      }
    ]
    return (
      <MessageDialog
        className="import-html-select-notebook-dialog"
        ref={el => (this.dialog = el)}
        title="Import Notes from HTML"
        message={<div className="ui message">Please select a notebook</div>}
        buttons={buttons}
      >
        <div className="ui form">
          <div className="field">
            <NotebooklistBar onItemSelect={this.handleNotebookSelect} />
          </div>
        </div>
      </MessageDialog>
    )
  }

  handleNotebookSelect = bookId => {
    this.importHTMLFile(bookId)
  }

  importHTMLFile = async destBookId => {
    const { dialog } = this
    const {
      openImportDialog,
      importHTMLFromMultipleFiles
    } = require('./importer')
    const files = openImportDialog()
    if (files) {
      dialog.dismissDialog(-1)
      await importHTMLFromMultipleFiles(files, destBookId)
    } else {
      return false
    }
  }

  handleImportHTMLFileCommand = () => {
    const { dialog } = this
    if (!dialog.isShown) {
      dialog.showDialog()
    }
  }
}
