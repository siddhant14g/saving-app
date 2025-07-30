import { useState, useEffect } from 'react';

function PinScreen({ onSuccess }) {
  const [pin, setPin] = useState('');
  const [attemptsLeft, setAttemptsLeft] = useState(5);
  const [isBlocked, setIsBlocked] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  const correctPin = '1302';
  const ATTEMPT_LIMIT = 5;
  const BLOCK_DURATION_MS = 10 * 60 * 1000; // 15 minutes

  useEffect(() => {
    const storedAttempts = parseInt(localStorage.getItem('pinAttempts')) || 0;
    const blockStart = parseInt(localStorage.getItem('blockStart')) || 0;
    const now = Date.now();

    if (blockStart && now - blockStart < BLOCK_DURATION_MS) {
      setIsBlocked(true);
      updateTimeLeft(blockStart);
    } else {
      localStorage.removeItem('blockStart');
      setAttemptsLeft(ATTEMPT_LIMIT - storedAttempts);
    }
  }, []);

  useEffect(() => {
    if (isBlocked) {
      const interval = setInterval(() => {
        const blockStart = parseInt(localStorage.getItem('blockStart')) || 0;
        updateTimeLeft(blockStart);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isBlocked]);

  const updateTimeLeft = (blockStart) => {
    const elapsed = Date.now() - blockStart;
    const remaining = BLOCK_DURATION_MS - elapsed;

    if (remaining <= 0) {
      setIsBlocked(false);
      setAttemptsLeft(ATTEMPT_LIMIT);
      localStorage.removeItem('blockStart');
      localStorage.removeItem('pinAttempts');
    } else {
      setTimeLeft(Math.ceil(remaining / 1000));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isBlocked) return;

    if (pin === correctPin) {
      localStorage.setItem('pinTimestamp', Date.now());
      localStorage.removeItem('pinAttempts');
      localStorage.removeItem('blockStart');
      onSuccess();
    } else {
      const currentAttempts = parseInt(localStorage.getItem('pinAttempts')) || 0;
      const newAttempts = currentAttempts + 1;

      if (newAttempts >= ATTEMPT_LIMIT) {
        localStorage.setItem('blockStart', Date.now());
        setIsBlocked(true);
        setTimeLeft(BLOCK_DURATION_MS / 1000);
      }

      localStorage.setItem('pinAttempts', newAttempts);
      setAttemptsLeft(Math.max(ATTEMPT_LIMIT - newAttempts, 0));
      setPin('');
      alert('Incorrect PIN. Try again.'); // Notify user of incorrect PIN
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  };

  return (
    <div className="mt-47 flex items-center justify-center bg-sky-200 bg-opacity-40">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-md space-y-4 w-full max-w-xs text-center"
      >
        <h2 className="text-lg font-semibold">Enter 4-digit PIN</h2>

        {isBlocked ? (
          <p className="text-red-600 font-semibold">
            Too many failed attempts. Try again in {formatTime(timeLeft)}.
          </p>
        ) : (
          <>
            <input
              type="password"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={4}
              className="border p-2 rounded w-full text-center text-xl tracking-widest"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              required
            />
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
            >
              Unlock
            </button>
            <p className="font-semibold text-sm text-green-600">Attempts left: {attemptsLeft}</p>
          </>
        )}
      </form>
    </div>
  );
}

export default PinScreen;
