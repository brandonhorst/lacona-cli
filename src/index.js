#! /usr/bin/env node

import _ from 'lodash'
import blessed from 'blessed'
import { resolve } from 'path'

const colors = {
  action: '#6699cc',
  argument0: '#f2777a',
  argument1: '#f99157',
  argument2: '#ffcc66',
  argument3: '#99cc99',
  argument4: '#66cccc',
  argument5: '#cc99cc',
  argument6: '#d27b53',
  conjunction: '#747369',
  inputBG: '#2d2d2d',
  selectionBG: '#393939',
  inputText: '#d3d0c8'
}

function colorizeWord({text, input, argument, placeholder, category}) {
  let returnText = text

  if (placeholder) {
    returnText = `{red-bg}${returnText}{/}`
  } else if (input) {
    returnText = `{underline}${returnText}{/}`
  }

  if (category === 'action') {
    returnText = `{${colors.action}-fg}${returnText}{/}`
  } else if (category === 'conjunction') {
    returnText = `{${colors.conjunction}-fg}${returnText}{/}`
  }

  return returnText
}

export class ConsoleLacona {
  constructor ({parser}) {
    this.parser = parser

    this.parser.on('update', this.parse.bind(this, true))

    this.oldInput = ''

    this.screen = blessed.screen({
      smartCSR: true,
      grabKeys: true,
      debug: true,
      title: 'my window title'
    })


    this.suggestionBox = blessed.list({
      left: 'center',
      width: '96%-10',
      height: 20,
      top: 1,
      style: {
        fg: colors.inputText,
        item: {
          bg: colors.inputBG,
        },
        selected: {
          bg: colors.selectionBG
        }
      },
      tags: true,
      invertSelected: false
    })

    this.inputBox = blessed.textarea({
      left: 'center',
      input: true,
      keyable: true,
      inputOnFocus: true,
      width: '96%',
      padding: {
        left: 5,
        right: 5
      },
      height: 1,
      content: 'Hello world!',
      style: {
        fg: colors.inputText,
        bg: colors.inputBG
      }
    })

    this.statusBar = blessed.text({
      height: 1,
      content: 'status bar',
      bottom: 1,
      width: '100%',
      bg: 'white',
      fg: 'black',
      left: 'center'
    })

    this.inputBox.key(['escape', 'C-c'], () => {
      this.screen.destroy()
    })

    this.inputBox.key(['up'], () => {
      this.suggestionBox.move(-1)
      this.screen.render()
    })

    this.inputBox.key(['down'], () => {
      this.suggestionBox.move(1)
      this.screen.render()
    })

    this.inputBox.on('keypress', (key) => {
      this.parse()
    })

    this.screen.append(this.inputBox)
    this.screen.append(this.suggestionBox)
    this.screen.append(this.statusBar)
    this.inputBox.focus()
  }

  parse (bypassSameCheck = false) {
    process.nextTick(() => {
      const input = this.inputBox.getValue()

      if (!bypassSameCheck && this.oldInput === input) {
        return
      } else {
        this.oldInput = input
      }

      const output = _.chain(this.parser.parseArray(input))
        .sortBy(({score}) => -score)
        .map('words')
        .map((words) => _.chain(words)
          .map(colorizeWord)
          .join('')
          .value()
        ).value()

      this.suggestionBox.setItems(output)

      this.screen.render()
    })
  }

  setStatus (status) {
    this.statusBar.setContent(status)
  }

  render () {
    this.screen.render()
  }
}
