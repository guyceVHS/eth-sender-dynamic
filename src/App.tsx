import { ConnectButton, useDynamicContext } from '@dynamic-labs/sdk-react-core';
import SendEthForm from './SendEthForm';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';

const App = () => {
  const { user, primaryWallet } = useDynamicContext();
  const [balance, setBalance] = useState<string | null>(null);

  useEffect(() => {
    const fetchBalance = async () => {
      if (primaryWallet) {
        const provider = new ethers.BrowserProvider(primaryWallet.connector);
        const address = await primaryWallet.connector.getAddress();
        const bal = await provider.getBalance(address);
        setBalance(ethers.formatEther(bal));
      }
    };
    fetchBalance();
  }, [primaryWallet]);

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1>🚀 ETH Sender</h1>
      <ConnectButton />
      {user && primaryWallet && (
        <div style={{ marginTop: '1rem' }}>
          <p><strong>User:</strong> {user.email || user.username}</p>
          <p><strong>Wallet:</strong> {primaryWallet.address}</p>
          <p><strong>Balance:</strong> {balance ? `${balance} ETH` : 'Loading...'}</p>
          <SendEthForm />
        </div>
      )}
    </div>
  );
};

export default App;
