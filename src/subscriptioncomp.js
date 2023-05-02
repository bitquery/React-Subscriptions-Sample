import React, { useEffect, useState } from 'react';
import axios from 'axios';

export function MyComponent() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const url = 'wss://streaming.bitquery.io/graphql';
    const message = JSON.stringify({
      "type": "start",
      "id": "1",
      "payload": {
        "query": "subscription {\n  EVM {\n    Transfers {\n      Transfer {\n        Amount\n        __typename\n        Currency {\n          __typename\n          Symbol\n        }\n      }\n    }\n  }\n}",
        "variables": {}
      },
      "headers": {
        "X-API-KEY": "your key here"
      }
    });

    let ws = new WebSocket(url, 'graphql-ws');

    const connect = () => {
      ws = new WebSocket(url, 'graphql-ws');

      ws.onopen = () => {
        ws.send(message);
      };

      ws.onmessage = (event) => {
        const response = JSON.parse(event.data);

        if (response.type === 'data') {
          setData(response.payload.data.EVM.Transfers.map(t => t.Transfer));
        }
      };

      ws.onclose = () => {
        console.log("WebSocket disconnected. Retrying in 5 seconds...");
        setTimeout(connect, 5000);
      };
    };

    connect();

    return () => {
      ws.close();
      console.log("WebSocket disconnected.");
    };
  }, []);

  return (
    <div>
      <h1>Transfer Data:</h1>
      <ul>
        {data.map((item, index) => (
          <li key={index}>
            {item.Amount} {item.Currency.Symbol}
          </li>
        ))}
      </ul>
    </div>
  );
}
