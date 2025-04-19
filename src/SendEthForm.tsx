import { useState } from 'react';
import { ethers } from 'ethers';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';

const SendEthForm = () => {
  const { primaryWallet } = useDynamicContext();
  const [to, setTo] = useState('');
  const [amount, setAmount] = useState('');
  const [txHash, setTxHash] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const sendEth = async () => {
    if (!primaryWallet) return;

    setLoading(true);
    setError('');
    setTxHash('');

    try {
      const provider = new ethers.BrowserProvider(primaryWallet.connector);
      const signer = await provider.getSigner();
      const tx = await signer.sendTransaction({
        to,
        value: ethers.parseEther(amount),
      });
      await tx.wait();
      setTxHash(tx.hash);
    } catch (err: any) {
      setError(err.message || 'Error sending ETH');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: '1rem' }}>
      <h3>Send ETH</h3>
      <label>Recipient Address:</label><br />
      <input value={to} onChange={e => setTo(e.target.value)} style={{ width: '100%', padding: '0.5rem' }} /><br /><br />
      <label>Amount (ETH):</label><br />
      <input value={amount} onChange={e => setAmount(e.target.value)} style={{ width: '100%', padding: '0.5rem' }} /><br /><br />
      <button onClick={sendEth} disabled={loading}>
        {loading ? 'Sending...' : 'Send ETH'}
      </button>
      {txHash && <p>✅ Sent! TX Hash: <a href={`https://basescan.org/tx/${txHash}`} target="_blank">{txHash}</a></p>}
      {error && <p>❌ Error: {error}</p>}
    </div>
  );
};

export default SendEthForm;
