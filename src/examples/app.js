import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  NavLink,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom';

import Bwdl from './bwdl';
import BwdlEditable from './bwdl-editable';
import Graph from './graph';

import './app.scss';

class App extends React.Component {
  render() {
    return (
      <Router>
        <div>
          <Route exact={true} path="/" component={Graph} />
        </div>
      </Router>
    );
  }
}

if (typeof window !== 'undefined') {
  window.onload = () => {
    ReactDOM.render(<App />, document.getElementById('content'));
  };
}
