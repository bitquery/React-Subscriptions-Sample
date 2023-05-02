import { ApolloClient, InMemoryCache, createHttpLink, defaultDataIdFromObject } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { getMainDefinition } from '@apollo/client/utilities';
import { split } from 'apollo-link';

import { WebSocketLink } from 'apollo-link-ws';
import { SubscriptionClient } from 'subscriptions-transport-ws';

const httpLink = createHttpLink({
  uri: 'https://streaming.bitquery.io/graphql',
});

const subscriptionClient = new SubscriptionClient('wss://streaming.bitquery.io/graphql', {
  reconnect: true,
});

const wsLink = new WebSocketLink(subscriptionClient);

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      authorization: 'YOUR KEY',
    },
  };
});

const link = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  authLink.concat(httpLink)
);




const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
  },
});

export { client };
