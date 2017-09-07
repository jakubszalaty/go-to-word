# Change Log


## Since 0.2.5 (7 Sep 2017):
- Restore default search word regExp to '\w+'

## Since 0.2.4 (7 Sep 2017):
- Change search word regExp from '\w+' to '((?![. <>`'"!@#$%^&*()=+]).)+'
- Added option to change search word regExp `goToWord.matchRegExp`

## Since 0.2.3 (28 Aug 2017):
- Added execute command `actions.find` after select word
- Added back to previous position after cancel search

## Since 0.2.2 (27 Aug 2017):
- Added keywords

## Since 0.2.1 (26 Aug 2017):
- Added icon

## Since 0.2.0 (26 Aug 2017):
- Improve display selected word
- Added execute command `removeSecondaryCursors` to remove multiple selections

## Since 0.1.0 (25 Aug 2017):
- Initial release
- Added `goToWord.find` command
- Added execute command `editor.action.addSelectionToNextFindMatch` after select word