import React from 'react';
import ReactDOM from 'react-dom';
import Relay from 'react-relay';

// purposefully calling Relay 'routes' roots (as in Query Root)
import ExampleRoot from './roots/ExampleRoot';
import Application from './containers/Application';
import RelayQuery from 'react-relay/lib/RelayQuery.js';
import RelayQueryRequest from 'react-relay/lib/RelayQueryRequest.js';

class Root extends React.Component {
  render() {
    return (
      <Relay.RootContainer
        Component={ Application }
        route={ new ExampleRoot() } />
    );
  }
}

/**
 * Walking through Relay code
 */
var relayRootContainer = new Relay.RootContainer( {
	Component: Application,
	route: new ExampleRoot()
})

var graphQLQuery = relayRootContainer.props.route.queries.example( relayRootContainer.props.Component ); // graphQLQuery instanceof GraphQLQuery

var relayQueryRoot =  new RelayQuery.Root(
	graphQLQuery,
	relayRootContainer.props.route,
	{})

var relayQueryRequest = new RelayQueryRequest( relayQueryRoot )

console.warn( 'Printing the query' )
console.warn( relayQueryRequest.getQueryString() )

/**
 * The magic ends here
 */

ReactDOM.render(
  <Root />,
  document.getElementById('container')
);