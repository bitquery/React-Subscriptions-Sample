import React from 'react';
import { ApolloProvider } from '@apollo/client';
import { SubscriptionComponent } from './subscriptioncomp';
import { client } from './client';

function App() {
  return (
    <ApolloProvider client={client}>
      <div className="App">
        <SubscriptionComponent />
      </div>
    </ApolloProvider>
  );
}

export default App;
