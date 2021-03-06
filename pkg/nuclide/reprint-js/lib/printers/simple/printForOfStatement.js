'use babel';
/* @flow */

/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

import type {ForInStatement} from 'ast-types-flow';
import type {Lines, Print} from '../../types/common';

var markers = require('../../constants/markers');
var wrapStatement = require('../../wrappers/simple/wrapStatement');

function printForOfStatement(print: Print, node: ForInStatement): Lines {
  const wrap = x => wrapStatement(print, node, x);
  return wrap([
    markers.hardBreak,
    'for (',
    markers.openScope,
    markers.scopeIndent,
    markers.scopeBreak,
    print(node.left),
    markers.noBreak,
    markers.space,
    'of',
    markers.noBreak,
    markers.space,
    print(node.right),
    markers.scopeBreak,
    markers.scopeDedent,
    markers.closeScope,
    ')',
    markers.space,
    print(node.body),
  ]);
}

module.exports = printForOfStatement;
