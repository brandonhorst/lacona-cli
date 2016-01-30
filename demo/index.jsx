/** @jsx createElement */

import _ from 'lodash'
import { createElement, Phrase } from 'lacona-phrase'

export const grammar = (
  <choice>
    <literal text='alpha' />
    <literal text='beta' />
    <literal text='charlie' />
  </choice>
)
