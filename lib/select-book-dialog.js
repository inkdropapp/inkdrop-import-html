"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const inkdrop_1 = require("inkdrop");
const react_1 = require("react");
const env_js_1 = require("./env.js");
const importer_1 = require("./importer");
const ImportHTMLSelectNotebookDialog = () => {
    const NotebookListBar = (0, env_js_1.getEnv)().components.classes.NotebookListBar;
    const modal = (0, inkdrop_1.useModal)();
    const Dialog = (0, env_js_1.getEnv)().components.classes.Dialog;
    const showDialog = (0, react_1.useCallback)(() => {
        modal.show();
    }, [modal]);
    const importHTMLFile = (0, react_1.useCallback)(async (destBookId) => {
        const { filePaths } = await (0, importer_1.openImportDialog)();
        if (filePaths) {
            modal.close();
            await (0, importer_1.importHTMLFromMultipleFiles)(filePaths, destBookId);
        }
        else {
            return false;
        }
    }, [modal]);
    const handleNotebookSelect = (0, react_1.useCallback)((bookId) => {
        importHTMLFile(bookId);
    }, [importHTMLFile]);
    (0, react_1.useEffect)(() => {
        const sub = (0, env_js_1.getEnv)().commands.add(document.body, {
            'import-html:import-from-file': showDialog
        });
        return () => sub.dispose();
    }, [showDialog]);
    return ((0, jsx_runtime_1.jsxs)(Dialog, { ...modal.state, large: true, onBackdropClick: modal.close, onEscKeyDown: modal.close, className: "import-html-select-notebook-dialog", children: [(0, jsx_runtime_1.jsx)(Dialog.Title, { children: "Import Notes from HTML" }), (0, jsx_runtime_1.jsxs)(Dialog.Content, { flex: true, children: [(0, jsx_runtime_1.jsx)("div", { className: "ui message", style: { flex: '0 0' }, children: "Please select a notebook" }), (0, jsx_runtime_1.jsx)(NotebookListBar, { onItemSelect: handleNotebookSelect })] }), (0, jsx_runtime_1.jsx)(Dialog.Actions, { children: (0, jsx_runtime_1.jsx)("button", { className: "ui button", onClick: modal.close, children: "Cancel" }) })] }));
};
exports.default = ImportHTMLSelectNotebookDialog;
