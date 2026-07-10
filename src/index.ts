import type { Environment, IInkdropPlugin } from '@inkdropapp/types'

import { setEnv } from './env.js'
import ImportHTMLSelectNotebookDialog from './select-book-dialog.js'

class InkdropPlugin implements IInkdropPlugin {
  activate(env: Environment) {
    setEnv(env)
    env.components.registerClass(ImportHTMLSelectNotebookDialog)
    env.layouts.addComponentToLayout('modal', 'ImportHTMLSelectNotebookDialog')
  }

  deactivate(env: Environment) {
    env.layouts.removeComponentFromLayout('modal', 'ImportHTMLSelectNotebookDialog')
    env.components.deleteClass(ImportHTMLSelectNotebookDialog)
    setEnv(undefined)
  }
}

const plugin = new InkdropPlugin()
export default plugin
