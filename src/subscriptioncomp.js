import React from 'react';
import { useSubscription, gql, useQuery } from '@apollo/client';
import { useEffect } from 'react';

import { groupBy, sumBy } from 'lodash';
const TRANSFER_QUERY = gql`
  subscription {
  EVM {
    Transfers(limit: {count: 10}) {
      Transfer {
        Amount
        __typename
        Currency {
          __typename
          Symbol
        }
      }
    }
  }
}
`;






export function SubscriptionComponent() {


  const { data, loading, error } = useQuery(TRANSFER_QUERY);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.toString()}</p>;
  }


 

  const transfers = data.EVM.Transfers.map((transfer) => transfer.Transfer);

  return (
    <div>
      <p>Transfers:</p>
      <table>
        <thead>
          <tr>
            <th>Amount</th>
            <th>Currency</th>
          </tr>
        </thead>
        <tbody>
          {transfers.map((transfer, index) => (
            <tr key={index}>
              <td>{transfer.Amount}</td>
              <td>{transfer.Currency.Symbol}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
