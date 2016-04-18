/** @jsx createElement */

import _ from 'lodash'
import { Parser } from 'lacona'
import { ConsoleLacona } from '..'
import { createElement, compile } from 'elliptical'
import { DateTime } from 'elliptical-datetime'
// import { Decimal } from 'lacona-phrase-number'

const grammar = (
  <sequence>
    <literal text='remind me to '/>
    <label text='ACTIVITY'>
      <freetext trimmed limit={2} splitOn=' ' />
    </label>
    <sequence optional>
      <literal text=' ' />
      <DateTime prepositions />
    </sequence>
  </sequence>
)

const parse = compile(grammar)
const cons = new ConsoleLacona(parse)
cons.render()