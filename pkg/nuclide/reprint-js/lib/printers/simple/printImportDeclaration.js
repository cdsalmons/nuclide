'use babel';
/* @flow */

/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

import type {ImportDeclaration} from 'ast-types-flow';
import type {Lines, Print} from '../../types/common';

var flatten = require('../../utils/flatten');
var invariant = require('assert');
var markers = require('../../constants/markers');

function printImportDeclaration(print: Print, node: ImportDeclaration): Lines {
  let open = false;
  let specifiers = node.specifiers.map((specifier, i, arr) => {
    let parts = [];

    // Check if we should open.
    if (!open && specifier.type === 'ImportSpecifier') {
      open = true;
      parts = parts.concat([
        '{',
      ]);
    }

    // Print the specifier.
    parts = parts.concat([
      markers.noBreak,
      print(specifier),
      markers.noBreak,
    ]);

    // Check if we should close. Note that it's important we be able to open
    // and then close within a single cycle of this loop.
    if (open && i === arr.length - 1) {
      open = false;
      parts = parts.concat([
        '}',
      ]);
    }

    // Check if we should add a comma and space.
    if (i < arr.length - 1) {
      parts = parts.concat([
        markers.comma,
        markers.space,
      ]);
    }

    return parts;
  });
  invariant(!open, 'Import declaration left open somehow.');
  return flatten([
    'import',
    markers.space,
    node.importKind === 'type' ? ['type', markers.space] : markers.empty,
    specifiers,
    markers.space,
    'from',
    markers.noBreak,
    markers.space,
    print(node.source),
    markers.noBreak,
    ';',
    markers.hardBreak,
  ]);
}

module.exports = printImportDeclaration;
