import React from 'react';
import ReactDOM from 'react-dom';
import Relay from 'react-relay';

// purposefully calling Relay 'routes' roots (as in Query Root)
import ExampleRoot from './roots/ExampleRoot';
import Application from './containers/Application';

// https://facebook.github.io/relay/docs/guides-network-layer.html
Relay.injectNetworkLayer(
  new Relay.DefaultNetworkLayer('http://localhost:8080/graphql', {
    credentials: 'same-origin',
    fetchTimeout: 30000,  // Timeout after 30s.
    retryDelays: [5000]   // Only retry once after a 5s delay.
  })
);

class Root extends React.Component {
  render() {
    return (
      <Relay.RootContainer
        Component={ Application }
        route={ new ExampleRoot() } />
    );
  }
}

ReactDOM.render(
  <Root />,
  document.getElementById('container')
);