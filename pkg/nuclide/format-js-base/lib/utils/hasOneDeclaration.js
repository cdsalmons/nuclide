'use babel';
/* @flow */

/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

import type {Node} from '../types/ast';

var jscs = require('jscodeshift');

var {match} = jscs;

function hasOneDeclaration(node: Node): boolean {
  if (!match(node, {type: 'VariableDeclaration'})) {
    return false;
  }
  return node.declarations.length === 1;
}

module.exports = hasOneDeclaration;
