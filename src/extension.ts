'use strict'

import * as vscode from 'vscode'
import {
    window,
    Position,
    Range,
    Selection,
    QuickPickItem,
    TextEditor,
} from 'vscode'


import * as R from 'ramda'

export function activate(context: vscode.ExtensionContext) {

    const goToWord = vscode.commands
        .registerCommand('goToWord.find', () => {
            const editor = window.activeTextEditor
            const document = editor.document
            const text = document.getText()

            const findWordLine = (regExp, str) => {
                const lines = str.split('\n')
                const result =
                    R.pipe(
                        R.mapObjIndexed((value: string, key) => ({ match: R.match(regExp, value), key })),
                        R.pickBy((value, key) => R.pipe(R.prop('match'), R.length, R.equals(0), R.not)(value)),
                        R.values,
                    )(lines)
                return result
            }

            const allWords: any = R.pipe(
                R.match(/\w+/g),
                R.uniq,
                R.mapObjIndexed((value, key) => ({ label: value })),
                R.values,
            )(text)

            window.showQuickPick(allWords, {
                placeHolder: 'Find word',
                onDidSelectItem: (value: any) => {

                    const label = value.label
                    const detail = value.detail
                    const list = R.filter(R.propSatisfies((x) => x === label, 'label'))(allWords)
                    const index = 0
                    const regExp = new RegExp(String(label))
                    const lines = findWordLine(regExp, text)


                    const selectedLine: any = lines[index]

                    const line = parseInt(selectedLine.key, 10)
                    const length = selectedLine.match[0].length
                    const character = selectedLine.match.index
                    // @TODO: clear find input before setCursorPosition or insert value to find input
                    setCursorPosition(editor, line, character, length)
                },
            })
        })

    context.subscriptions.push(goToWord)
}

export function deactivate() {
    // empty
}

function setCursorPosition(editor: TextEditor, line: number, character: number, length: number) {
    const start = new Position(line, character)
    const end = new Position(line, character + length)

    const bottom = new Position(line + 50, 0)
    const newSelection = new Selection(start, end)
    editor.revealRange(new Range(start, bottom))
    editor.selection = newSelection
}
