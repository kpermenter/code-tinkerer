import './editor.css';
import './syntax.css';
import CodeEditor, { EditorDidMount } from '@monaco-editor/react'
import React, { useRef } from 'react'
import { Header } from '../Header/Header';
import prettier from 'prettier';
import parser from 'prettier/parser-babel';
import codeShift from 'jscodeshift';
import Highlighter from 'monaco-jsx-highlighter';

interface CodeEditorProps {
  initialValue: string;
  onChange(value: string): void
}

export const Editor: React.FC<CodeEditorProps> = ({ onChange, initialValue }) => {
  const editor = useRef<any>();
  const onEditorDidMount: EditorDidMount = (getValue, monacoEditor) => {
    editor.current = monacoEditor;
    monacoEditor.onDidChangeModelContent(() => {
      onChange(getValue());
    });

    monacoEditor.getModel()?.updateOptions({ tabSize: 2 });
    const highlighter = new Highlighter(
      // @ts-ignore
      window.monaco,
      codeShift,
      monacoEditor
    );

    highlighter.highLightOnDidChangeModelContent(
      () => { },
      () => { },
      undefined,
      () => { }
    );
  }

  const onFormatClick = () => {
    // get the current value from the editor
    const unformatted = editor.current.getModel()?.getValue();

    // format that value
    const formatted = prettier.format(unformatted, {
      parser: 'babel',
      plugins: [parser],
      useTabs: false,
      semi: true,
      singleQuote: true
    }).replace(/\n$/, '');

    // set the formatted value to the editor
    editor.current.setValue(formatted);
  }

  return (
    <>
      <Header />
      <div className="editor-wrapper">
        <button
          className="button button-format is-primary is-small" style={{ marginRight: 10 }} onClick={onFormatClick}>Format</button>
        <CodeEditor
          editorDidMount={onEditorDidMount}
          value={initialValue}
          theme="dark"
          language="javascript"
          height="500px"
          options={{
            wordWrap: 'on',
            minimap: { enabled: false },
            showUnused: false,
            folding: false,
            lineNumbersMinChars: 3,
            fontSize: 16,
            scrollBeyondLastLine: false,
            automaticLayout: true
          }}
        />
      </div>
    </>
  );
}
