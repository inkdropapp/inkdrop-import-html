const ImportHTMLSelectNotebookDialog = require('./select-book-dialog').default

module.exports = {
  activate() {
    inkdrop.components.registerClass(ImportHTMLSelectNotebookDialog)
    inkdrop.layouts.addComponentToLayout(
      'modal',
      'ImportHTMLSelectNotebookDialog'
    )
  },

  deactivate() {
    inkdrop.layouts.removeComponentFromLayout(
      'modal',
      'ImportHTMLSelectNotebookDialog'
    )
    inkdrop.components.deleteClass(ImportHTMLSelectNotebookDialog)
  }
}
