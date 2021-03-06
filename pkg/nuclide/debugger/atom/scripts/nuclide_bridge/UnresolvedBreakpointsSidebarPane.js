'use babel';
/* @flow */

/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

var NuclideBridge = require('./NuclideBridge');
var React = require('react');
var path = require('path');
var url = require('url');
import invariant from 'assert';

var WebInspector: typeof WebInspector = window.WebInspector;

var UnresolvedBreakpointsComponent = React.createClass({
  _changeHandler: {dispose: () => {}},

  componentWillMount() {
    this._changeHandler = NuclideBridge.onUnresolvedBreakpointsChanged(this._updateState);
  },

  componentWillUnmount() {
    this._changeHandler.dispose();
  },

  render() {
    var children = this.state.breakpoints.map(breakpoint => {
      var {pathname} = url.parse(breakpoint.url);
      invariant(pathname);
      var longRep = `${pathname}:${breakpoint.line + 1}`;
      var shortRep = `${path.basename(pathname)}:${breakpoint.line + 1}`;
      return (
        <li
          key={longRep}
          className="cursor-pointer source-text"
          onClick={this._onBreakpointClick.bind(this, breakpoint)}
          title={longRep}>
          {shortRep}
        </li>
      );
    });
    return (
      <ol className="breakpoint-list">
        {this.state.breakpoints.length > 0
          ? children
          : <div className="info">None</div>}
      </ol>
    );
  },

  _onBreakpointClick(breakpoint: {url: string, line: number}) {
    NuclideBridge.sendOpenSourceLocation(breakpoint.url, breakpoint.line);
  },

  getInitialState() {
    return this._getState();
  },

  _updateState() {
    this.setState(this._getState());
  },

  _getState() {
    return {
      breakpoints: NuclideBridge.getUnresolvedBreakpointsList(),
    };
  },
});

class UnresolvedBreakpointsSidebarPane extends WebInspector.SidebarPane {
  constructor() {
    // WebInspector classes are not es6 classes, but babel forces a super call.
    super();
    // Actual super call.
    WebInspector.SidebarPane.call(this, 'Unresolved Breakpoints');

    this.registerRequiredCSS('components/breakpointsList.css');

    React.render(
      <UnresolvedBreakpointsComponent />,
      this.bodyElement);

    this.expand();
  }

  // This is implemented by various UI views, but is not declared anywhere as
  // an official interface. There's callers to various `reset` functions, so
  // it's probably safer to have this.
  reset() {
  }
}

module.exports = UnresolvedBreakpointsSidebarPane;
