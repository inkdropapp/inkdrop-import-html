"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const select_book_dialog_js_1 = __importDefault(require("./select-book-dialog.js"));
class InkdropPlugin {
    activate() {
        inkdrop.components.registerClass(select_book_dialog_js_1.default);
        inkdrop.layouts.addComponentToLayout('modal', 'ImportHTMLSelectNotebookDialog');
    }
    deactivate() {
        inkdrop.layouts.removeComponentFromLayout('modal', 'ImportHTMLSelectNotebookDialog');
        inkdrop.components.deleteClass(select_book_dialog_js_1.default);
    }
}
const plugin = new InkdropPlugin();
exports.default = plugin;
