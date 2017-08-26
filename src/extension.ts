'use strict'

import * as vscode from 'vscode'
import {
    window,
    Position,
    Range,
    Selection,
    QuickPickItem,
    TextEditor,
    commands,
} from 'vscode'


import * as R from 'ramda'

export function activate(context: vscode.ExtensionContext) {

    const goToWord = vscode.commands
        .registerCommand('goToWord.find', () => {
            const editor = window.activeTextEditor
            const document = editor.document
            const text = document.getText()

            const allWords: any = R.pipe(
                R.match(/\w+/g),
                R.uniq,
                R.mapObjIndexed((value, key) => ({ label: value })),
                R.values,
            )(text)

            let lastQuery = ''

            window.showQuickPick(allWords, {
                placeHolder: 'Find word',
                onDidSelectItem: (value: any) => {
                    moveToWord(value, editor, allWords, text)
                },
            }).then((value: any) => {
                lastQuery = value.label
                moveToWord(value, editor, allWords, text)
                // #Hack. Add selected word into find input
                commands.executeCommand('editor.action.addSelectionToNextFindMatch')
                commands.executeCommand('removeSecondaryCursors')

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
    const newSelection = new Selection(start, end)

    const top = line - 20 >= 0 ? line - 20 : 0
    const topPosition = new Position(top, 0)
    const bottom = line + 20
    const bottomPosition = new Position(bottom, 0)
    const newRange = new Range(topPosition, bottomPosition)


    editor.revealRange(newRange)
    editor.selections = [newSelection]
}

function findWordLine(regExp, str) {
    const lines = str.split('\n')
    const result =
        R.pipe(
            R.mapObjIndexed((value: string, key) => ({ match: R.match(regExp, value), key })),
            R.pickBy((value, key) => R.pipe(R.prop('match'), R.length, R.equals(0), R.not)(value)),
            R.values,
        )(lines)
    return result
}

function moveToWord(value: any, editor, allWords, text) {

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
    setCursorPosition(editor, line, character, length)
}
