"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const env_js_1 = require("./env.js");
const select_book_dialog_js_1 = __importDefault(require("./select-book-dialog.js"));
class InkdropPlugin {
    activate(env) {
        (0, env_js_1.setEnv)(env);
        env.components.registerClass(select_book_dialog_js_1.default);
        env.layouts.addComponentToLayout('modal', 'ImportHTMLSelectNotebookDialog');
    }
    deactivate(env) {
        env.layouts.removeComponentFromLayout('modal', 'ImportHTMLSelectNotebookDialog');
        env.components.deleteClass(select_book_dialog_js_1.default);
        (0, env_js_1.setEnv)(undefined);
    }
}
const plugin = new InkdropPlugin();
exports.default = plugin;
