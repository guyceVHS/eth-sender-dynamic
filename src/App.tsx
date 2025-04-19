import {
  DynamicContextProvider,
  useDynamicContext,
} from '@dynamic-labs/sdk-react-core';
import { EthereumWalletConnectors } from '@dynamic-labs/ethereum';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';

const DynamicApp = () => {
  const {
    user,
    primaryWallet,
    isAuthenticated,
    setShowAuthFlow,
  } = useDynamicContext();

  const [ethBalance, setEthBalance] = useState<string>('');
  const [toAddress, setToAddress] = useState('');
  const [amount, setAmount] = useState('');

  useEffect(() => {
    const fetchBalance = async () => {
      if (primaryWallet?.address && primaryWallet?.connector) {
        const provider = new ethers.BrowserProvider(primaryWallet.connector);
        const balance = await provider.getBalance(primaryWallet.address);
        setEthBalance(ethers.formatEther(balance));
      }
    };

    if (isAuthenticated) {
      fetchBalance();
    }
  }, [isAuthenticated, primaryWallet]);

  const sendETH = async () => {
    if (!primaryWallet?.connector) return alert('Wallet not connected');

    try {
      const provider = new ethers.BrowserProvider(primaryWallet.connector);
      const signer = await provider.getSigner();
      const tx = await signer.sendTransaction({
        to: toAddress,
        value: ethers.parseEther(amount),
      });
      await tx.wait();
      alert('Transaction successful!');
    } catch (error) {
      console.error(error);
      alert('Transaction failed.');
    }
  };

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '2rem' }}>
      <h1>ETH Sender</h1>

      {!isAuthenticated ? (
        <button onClick={() => setShowAuthFlow(true)}>Login with Email</button>
      ) : (
        <div>
          <p><strong>Wallet:</strong> {primaryWallet?.address}</p>
          <p><strong>Balance:</strong> {ethBalance} ETH</p>

          <input
            type="text"
            placeholder="Recipient address"
            value={toAddress}
            onChange={(e) => setToAddress(e.target.value)}
            style={{ display: 'block', margin: '10px 0', width: '300px' }}
          />

          <input
            type="text"
            placeholder="Amount in ETH"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={{ display: 'block', margin: '10px 0', width: '300px' }}
          />

          <button onClick={sendETH}>Send ETH</button>
        </div>
      )}
    </div>
  );
};

const App = () => {
  return (
    <DynamicContextProvider
      settings={{
        environmentId: 'b6cdbe7d-7c1b-4cb6-b03c-82551f074c9e', // your env ID
        walletConnectors: [EthereumWalletConnectors],
        authMode: 'email',
      }}
    >
      <DynamicApp />
    </DynamicContextProvider>
  );
};

export default App;
