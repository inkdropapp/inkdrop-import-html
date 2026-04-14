import ImportHTMLSelectNotebookDialog from './select-book-dialog.js'

class InkdropPlugin {
  activate() {
    inkdrop.components.registerClass(ImportHTMLSelectNotebookDialog)
    inkdrop.layouts.addComponentToLayout(
      'modal',
      'ImportHTMLSelectNotebookDialog'
    )
  }

  deactivate() {
    inkdrop.layouts.removeComponentFromLayout(
      'modal',
      'ImportHTMLSelectNotebookDialog'
    )
    inkdrop.components.deleteClass(ImportHTMLSelectNotebookDialog)
  }
}

const plugin = new InkdropPlugin()
export default plugin
