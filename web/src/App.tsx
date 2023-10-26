import { useEffect, useState } from 'react';
import './App.css'
import { useSDK } from '@metamask/sdk-react';
import { Maybe } from '@metamask/providers/dist/utils';

function App() {
  const [account, setAccount] = useState<string>();
  const { sdk, connected, connecting, provider, chainId } = useSDK();

  const connect = async () => {
    try {
      const accounts = await sdk?.connect() as Maybe<string[]>;
			console.log(accounts);
			setAccount(accounts?.[0]);
    } catch(err) {
      console.warn(`failed to connect..`, err);
    }
  };

	useEffect(() => {
		connect();
	}, []);

  return (
    <div className="App">
      <button style={{ padding: 10, margin: 10 }} onClick={connect}>
        Connect
      </button>
      {connected && (
        <div>
          <>
            {chainId && `Connected chain: ${chainId}`}
            <p></p>
            {account && `Connected account123: ${account}`}
          </>
        </div>
      )}
    </div>
	);
}

export default App
