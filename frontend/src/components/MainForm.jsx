import { useState, useEffect } from 'react';
import axios from 'axios';

function MainForm() {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [total, setTotal] = useState(0);
  const [message, setMessage] = useState('');
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');

  const API = 'https://saving-app-backend.vercel.app/api';
  // const API = 'http://localhost:5000/api'; // Use this for local development


  const fetchTotal = async () => {
    const res = await axios.get(`${API}/total`);
    setTotal(res.data.total);
    setMessage(res.data.message || '');
  };

  const fetchHistory = async () => {
    const res = await axios.get(`${API}/history`);
    setHistory(res.data);
  };

  useEffect(() => {
    fetchTotal();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !amount) return;
    await axios.post(`${API}/save`, { name, amount: Number(amount) });
    setAmount('');
    fetchTotal();
  };

  return (
    <div className="min-h-screen p-4 w-full max-w-md mx-auto space-y-6 bg-sky-200">
      {/* Total and Message */}
    
      <div className="text-center text-xl font-bold">
        💵 Total Saved: ₹{total}
        {message && <p className="text-green-600 mt-2 text-lg">{message}</p>}
      </div>
      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white p-4 rounded-xl shadow-md"
      >
        <div className="flex flex-col gap-2">
          <label className="font-semibold text-sm">Select Name:</label>
          <select
            className="border p-2 rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          >
            <option value="" disabled>Select your name</option>
            <option value="Siddhant">Siddhant</option>
            <option value="Sanika">Sanika</option>
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-semibold text-sm">Amount (₹):</label>
          <input
            type="number"
            className="border p-2 rounded"
            placeholder="Enter amount in ₹"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
        >
          Submit
        </button>
      </form>

      {/* Total and Message */}
      {/* <div className="text-center text-xl font-bold">
        💵 Total Saved: ₹{total}
        {message && <p className="text-green-600 mt-2 text-sm">{message}</p>}
      </div> */}

      {/* Withdraw Section */}
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          try {
            const withdrawAmt = Number(withdrawAmount);

            if (!withdrawAmount || isNaN(withdrawAmt) || withdrawAmt <= 0) {
              return alert('Enter a valid withdrawal amount greater than 0');
            }

            if (!name) {
              return alert('Please select a name');
            }

            if (total <= 0) {
              return alert('Cannot withdraw. Total savings is ₹0.');
            }

            if (withdrawAmt > total) {
              return alert(`Cannot withdraw ₹${withdrawAmt}. Only ₹${total} is available.`);
            }

            await axios.post(`${API}/save`, {
              name,
              amount: -Math.abs(withdrawAmt),
            });

            setWithdrawAmount('');
            fetchTotal();
          } catch (err) {
            console.error('Withdraw failed:', err.message);
            alert('Withdraw failed. Check console.');
          }
        }}

        className="space-y-2 bg-white p-4 rounded-xl shadow-md"
      >
        <label className="font-semibold text-sm">Withdraw Amount (₹):</label>
        <input
          type="number"
          placeholder="Enter amount to withdraw"
          className="border p-2 rounded w-full"
          value={withdrawAmount}
          onChange={(e) => setWithdrawAmount(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
        >
          Withdraw
        </button>
      </form>

      {/* History Button */}
      <button
        onClick={() => {
          fetchHistory();
          setShowHistory(!showHistory);
        }}
        className="w-full bg-gray-700 text-white py-2 rounded hover:bg-gray-800"
      >
        {showHistory ? 'Hide History' : 'View History'}
      </button>

      {/* History */}
      {showHistory && (
        <div className="bg-gray-100 p-4 rounded max-h-64 overflow-y-auto text-sm">
          <h3 className="font-semibold mb-2">📜 History</h3>
          <ul className="space-y-1">
            {history.map((entry) => (
              <li key={entry._id} className="border-b pb-1">
                {entry.name}{' '}
                {entry.amount > 0
                  ? `Deposited ₹${entry.amount}`
                  : `Withdrawn ₹${Math.abs(entry.amount)}`} on{' '}
                {new Date(entry.date).toLocaleDateString()}
              </li>
            ))}
          </ul>

        </div>
      )}
    </div>
  );
}

export default MainForm;
