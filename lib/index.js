'use babel'
import SelectBookDialog from './select-book-dialog'

module.exports = {
  activate () {
    inkdrop.components.registerClass(SelectBookDialog)
    inkdrop.layouts.addComponentToLayout('modals', 'SelectBookDialog')
  },

  deactivate () {
    inkdrop.layouts.removeComponentFromLayout('modals', 'SelectBookDialog')
    inkdrop.components.deleteClass(SelectBookDialog)
  }
}
